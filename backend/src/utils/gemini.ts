import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'
import { analysisJsonSchema } from "./gemini.schema.js";
import { ANALYSIS_PROMPT } from "../modules/analysis/analysis.prompt.js";

dotenv.config();
const ai = new GoogleGenAI({});


export const getResumeAnalysis = async (jobDescription: string, resume: string) => {
  const response = await ai.interactions.create({
    model: "gemini-flash-lite-latest",
    input: ANALYSIS_PROMPT(jobDescription, resume),
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: analysisJsonSchema
    }
  }
  );
  return JSON.parse(response.output_text!);
}