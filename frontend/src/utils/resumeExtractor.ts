import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Set up worker for PDF.js if available
try {
  if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.0.379'}/pdf.worker.min.mjs`;
  }
} catch {
  // Ignore worker setup issues; fallback will handle
}

/**
 * Fallback binary text parser for PDFs when worker is unavailable or fails
 */
function extractTextFromPdfBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let rawText = '';
  const textDecoder = new TextDecoder('utf-8', { fatal: false });
  const str = textDecoder.decode(bytes);

  // Extract text within parentheses in Tj and TJ operations: (Text) Tj or [(T) (e) (x) (t)] TJ
  const tjRegex = /\(([^)]+)\)\s*Tj/g;
  let match: RegExpExecArray | null;
  while ((match = tjRegex.exec(str)) !== null) {
    rawText += match[1] + ' ';
  }

  const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
  while ((match = tjArrayRegex.exec(str)) !== null) {
    const inner = match[1];
    const subMatches = inner.match(/\(([^)]+)\)/g);
    if (subMatches) {
      rawText += subMatches.map(s => s.replace(/[()]/g, '')).join('') + ' ';
    }
  }

  // If streams had FlateDecode and above was minimal, also look for printable ASCII runs
  if (rawText.trim().length < 50) {
    const asciiMatches = str.match(/[\w\s.,;:!?@#&()\-+/]{4,}/g);
    if (asciiMatches) {
      rawText = asciiMatches.filter(s => !s.includes('endobj') && !s.includes('xref')).join(' ');
    }
  }

  return rawText.replace(/\\r/g, ' ').replace(/\\n/g, '\n').replace(/\\([()])/g, '$1');
}

/**
 * Extract raw text from uploaded resume files (PDF, DOCX, TXT)
 */
export async function extractResumeText(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // 1. Plain Text (.txt)
  if (fileName.endsWith('.txt') || file.type === 'text/plain') {
    return await file.text();
  }

  // 2. Word Document (.docx)
  if (fileName.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result && result.value && result.value.trim().length > 0) {
        return result.value;
      }
    } catch (docxErr) {
      console.warn('Mammoth DOCX parsing fallback:', docxErr);
    }
  }

  // 3. PDF Document (.pdf)
  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true,
        disableFontFace: true,
      });
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => (item.str ? item.str : ''))
          .join(' ');
        fullText += pageText + '\n';
      }

      if (fullText.trim().length > 20) {
        return fullText;
      }
    } catch (pdfErr) {
      console.warn('PDF.js worker extraction fallback to binary parser:', pdfErr);
    }

    // Binary stream parser fallback
    const fallbackText = extractTextFromPdfBuffer(arrayBuffer);
    if (fallbackText.trim().length > 0) {
      return fallbackText;
    }
  }

  // Default fallback for any text-like file
  try {
    const text = await file.text();
    if (text && text.trim().length > 0) {
      return text;
    }
  } catch {
    // Ignore
  }

  throw new Error('Could not extract readable text from the uploaded file. Please verify it is a valid PDF, DOCX, or TXT resume.');
}
