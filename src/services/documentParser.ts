import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker if in browser
if (typeof window !== 'undefined') {
  try {
    // Attempt standard cdn worker
    if (pdfjsLib?.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
    }
  } catch (e) {
    console.warn('Could not initialize PDF worker:', e);
  }
}

/**
 * Extracts clean plain text from an uploaded File (PDF, DOCX, DOC, TXT, MD, RTF, etc.)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  try {
    if (extension === 'docx' || extension === 'doc') {
      return await extractDocx(file);
    } else if (extension === 'pdf') {
      return await extractPdf(file);
    } else if (extension === 'rtf') {
      return await extractRtf(file);
    } else {
      // Plain text / Markdown / CSV / JSON
      return await extractPlainText(file);
    }
  } catch (err) {
    console.warn('Primary file extractor encountered an issue, falling back to plain text extraction:', err);
    return await extractPlainText(file);
  }
}

/**
 * Extract DOCX using Mammoth with buffer fallback
 */
async function extractDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value?.trim();
    if (text && text.length > 20) {
      return text;
    }
  } catch (err) {
    console.warn('Mammoth docx parsing failed, attempting fallback text extraction:', err);
  }

  // Fallback for doc / raw files
  return extractPlainText(file);
}

/**
 * Extract PDF using pdfjs-dist with direct stream fallback
 */
async function extractPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Try pdfjs standard document parsing
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
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
    if (trimmed.length > 20) {
      return trimmed;
    }
  } catch (err) {
    console.warn('PDF parsing via pdfjs-dist worker failed, running direct binary text stream extractor:', err);
  }

  // Fallback: Direct binary string stream extractor for PDFs
  try {
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder('latin1');
    const rawString = decoder.decode(arrayBuffer);

    // Extract text blocks inside PDF BT...ET streams and plain strings
    const textBlocks: string[] = [];
    const streamRegex = /BT[\s\S]*?ET/g;
    let match;

    while ((match = streamRegex.exec(rawString)) !== null) {
      const block = match[0];
      // Match string literals inside parentheses e.g. (Job Title) Tj or [ (Senior) 20 (Engineer) ] TJ
      const stringMatches = block.match(/\(([^()]+)\)/g);
      if (stringMatches) {
        const line = stringMatches
          .map((s) => s.slice(1, -1))
          .join(' ')
          .replace(/\\([()\\])/g, '$1');
        if (line.trim().length > 0) {
          textBlocks.push(line);
        }
      }
    }

    if (textBlocks.length > 0) {
      const extracted = textBlocks.join('\n').trim();
      if (extracted.length > 30) {
        return extracted;
      }
    }
  } catch (rawErr) {
    console.warn('Binary stream PDF fallback failed:', rawErr);
  }

  return extractPlainText(file);
}

/**
 * Extract RTF content by stripping RTF formatting codes
 */
async function extractRtf(file: File): Promise<string> {
  const text = await extractPlainText(file);
  // Strip RTF control words and groups
  return text
    .replace(/\\([a-z]{1,32})(-?\d+)? ?/gi, '')
    .replace(/[{}\\]/g, '')
    .replace(/\r\n|\r|\n/g, '\n')
    .trim();
}

/**
 * Extract plain text safely
 */
async function extractPlainText(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        // Strip null bytes and non-printable control characters
        const sanitized = result
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/\n\s+\n/g, '\n\n')
          .trim();
        resolve(sanitized);
      } else {
        resolve('');
      }
    };
    reader.onerror = () => resolve('');
    reader.readAsText(file);
  });
}
