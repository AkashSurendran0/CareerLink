import { injectable } from "inversify";
import { ICreateCoverLetter } from "../domain/services/IResumeServices";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { logger } from "../utils/logger";

dotenv.config();

@injectable()
export class CreateCoverLetter implements ICreateCoverLetter {

    async createCoverLetter(data: Record<string, unknown>): Promise<{ success: boolean; content: string; provider: string } | { success: false; message: string }> {

        try {
            const payload = data as Record<string, unknown>;
            const fullName = String(payload.fullName ?? "");
            const companyName = String(payload.companyName ?? "");
            const position = String(payload.position ?? "");
            const hrName = String(payload.hrName ?? "");
            const finalEducation = Array.isArray(payload.finalEducation) ? payload.finalEducation as string[] : [];
            const finalExperiences = Array.isArray(payload.finalExperiences) ? payload.finalExperiences as Array<Record<string, unknown>> : [];
            const finalSkills = Array.isArray(payload.finalSkills) ? payload.finalSkills as string[] : [];
            const finalCertifications = Array.isArray(payload.finalCertifications) ? payload.finalCertifications as string[] : [];
            const finalInterests = Array.isArray(payload.finalInterests) ? payload.finalInterests as string[] : [];

            const prompt = `
    You are an expert cover-letter writer and a professional language editor.
    Your job is to generate a polished, professional cover letter with corrected spelling and normalized technical terms, while strictly following the user-provided data.
    
    Return only the final cover-letter text — no explanations, no markdown, and no code fences.
    
    Rules:
    
    1. Spelling & Grammar Correction
    - Correct all spelling mistakes in the user’s input.
    - Normalize technical skills (e.g., "doker" → "Docker", "node js" → "Node.js").
    - Do NOT add skills or experience that are not provided; only correct what exists.
    
    2. Salutation:
    - If hrName exists → “Dear ${hrName},”
    - If hrName is empty/null → “Dear Hiring Manager,”
    
    3. Structure (must follow exactly):
    - Salutation
    - Intro paragraph expressing interest in the role and company
    - Skills & education paragraph (corrected spelling)
    - Experience paragraph
    - Closing paragraph expressing enthusiasm
    - Professional sign-off (e.g., “Sincerely, [Name]”)
    
    4. Content Rules:
    - Use provided details naturally.
    - Skip empty fields entirely.
    - Keep the tone professional, concise, and tailored.
    - No extra information, no assumptions, no added facts.
    
    Here is the user data:
    
    Name:${fullName}
    Company Name: ${companyName}
    Position: ${position}
    HR Name: ${hrName}
    Education: ${finalEducation.join(", ")}
    Experience: ${finalExperiences
                    .map((ex) => `${String((ex as Record<string, unknown>).position ?? "")} (${String((ex as Record<string, unknown>).span ?? "")})`)
                    .join(", ")}
    Skills: ${finalSkills.join(", ")}
    Certifications: ${finalCertifications.join(", ")}
    Why interested in the company: ${finalInterests.join(", ")}
    
    Generate a polished, compelling cover letter using only the information above.
    
    `;
            const content = await this.callOpenRouter(prompt);

            return {
                success: true,
                content: content,
                provider: "openrouter"
            };
        } catch (error: unknown) {
            if (error instanceof Error) logger.info({ error: error.message }, "OpenRouter failed, trying fallback...");
            else logger.info("OpenRouter failed, trying fallback...");
            return {
                success: false,
                message: "Error generating cover letter, please try again later"
            };
        }
    }

    private async callOpenRouter(prompt: string): Promise<string> {
        const OPENROUTER_KEY = process.env.OPENROUTER_AI_API;

        const freeModels = [
            "google/gemini-2.0-flash-exp:free",
            "google/gemma-3-27b-it:free",
            "google/gemma-3-12b-it:free",
            "qwen/qwen3-coder:free",
            "qwen/qwen3-coder:free",
            "mistralai/mistral-small-3.1-24b-instruct:free",
            "meta-llama/llama-3.1-405b-instruct:free"
        ];

        for (const model of freeModels) {
            try {
                logger.info(`Trying OpenRouter model: ${model}`);

                const response = await axios.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    {
                        model: model,
                        messages: [
                            {
                                role: "user",
                                content: prompt
                            }
                        ],
                        max_tokens: 1000,
                        temperature: 0.7
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${OPENROUTER_KEY}`,
                            "Content-Type": "application/json",
                            "HTTP-Referer": process.env.FRONTEND_ROUTE, // Required by OpenRouter
                            "X-Title": "CareerLink Cover Letter Generator" // Optional but good
                        },
                        timeout: 30000 // 30 seconds
                    }
                );

                if (response.data?.choices?.[0]?.message?.content) {
                    logger.info(`Success with model: ${model}`);
                    return response.data.choices[0].message.content;
                }

            } catch (modelError: unknown) {
                if (modelError instanceof Error) logger.error({ model, error: modelError.message }, "Model failed:");
                else logger.error({ model }, "Model failed");
                continue; // Try next model
            }
        }

        throw new Error("All OpenRouter free models failed");
    }

}