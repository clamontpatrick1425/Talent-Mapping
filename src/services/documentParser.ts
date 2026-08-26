import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker if in browser
if (typeof window !== 'undefined') {
  try {
    // Use bundled/cdn worker for pdf.js to avoid worker resolution issues in Vite
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('Could not initialize PDF worker:', e);
  }
}

/**
 * Extracts plain text from an uploaded File (PDF, DOCX, DOC, TXT, MD, etc.)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  if (extension === 'docx' || extension === 'doc') {
    return extractDocx(file);
  } else if (extension === 'pdf') {
    return extractPdf(file);
  } else {
    // Plain text / Markdown / other textual files
    return extractPlainText(file);
  }
}

async function extractDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value?.trim();
    if (text && text.length > 0) {
      return text;
    }
  } catch (err) {
    console.warn('Mammoth docx parsing failed, attempting fallback:', err);
  }

  // Fallback: Try reading as text and clean non-printable characters if possible
  return extractPlainText(file);
}

async function extractPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => item.str || '')
        .join(' ');
      fullText += pageText + '\n\n';
    }

    const trimmed = fullText.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  } catch (err) {
    console.warn('PDF parsing with pdfjs failed, falling back to text stream:', err);
  }

  return extractPlainText(file);
}

async function extractPlainText(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        // Strip null bytes and non-printable control characters that cause wingdings
        const sanitized = result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ').trim();
        resolve(sanitized);
      } else {
        resolve('');
      }
    };
    reader.onerror = () => resolve('');
    reader.readAsText(file);
  });
}
