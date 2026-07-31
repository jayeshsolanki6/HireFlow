import { PDFParse } from 'pdf-parse'
import { ApiError } from './ApiError.js'

export const extractTextFromPdfUrl = async (pdfUrl: string) => {
  try {
    const parser = new PDFParse({url : pdfUrl});
    return (await parser.getText()).text;
  } catch (error) {
    throw new ApiError(500, "Failed to extract text from PDF.");
  }
}

// console.log(await extractTextFromPdfUrl("https://res.cloudinary.com/dr75ykm3r/image/upload/v1785318154/hireflow/resumes/oq2niidrulfqiwaxjlxp.pdf"));