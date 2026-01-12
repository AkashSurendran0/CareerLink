import { ICreateResume } from "../domain/services/IResumeServices";
import { injectable, inject } from "inversify";
import dotenv from "dotenv";
import pdf from "html-pdf-node";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { logger } from "../utils/logger";

dotenv.config();

@injectable()
export class CreateResume implements ICreateResume {

    async createResume(data: Record<string, unknown>): Promise<{ success: boolean; pdf: Buffer; html: string; provider: string } | { success: false; message: string }> {

        try {
            const payload = data as Record<string, unknown>;
            const fullName = String(payload.fullName ?? "");
            const email = String(payload.email ?? "");
            const phone = String(payload.phone ?? "");
            const location = String(payload.location ?? "");
            const summary = String(payload.summary ?? "");
            const finalEducation = Array.isArray(payload.finalEducation) ? payload.finalEducation as Array<Record<string, unknown>> : [];
            const finalSkills = Array.isArray(payload.finalSkills) ? payload.finalSkills as string[] : [];
            const finalCertifications = Array.isArray(payload.finalCertifications) ? payload.finalCertifications as string[] : [];
            const finalExperiences = Array.isArray(payload.finalExperiences) ? payload.finalExperiences as Array<Record<string, unknown>> : [];
            const finalProjects = Array.isArray(payload.finalProjects) ? payload.finalProjects as Array<Record<string, unknown>> : [];
            const finalInterests = Array.isArray(payload.finalInterests) ? payload.finalInterests as string[] : [];
            const finalLanguages = Array.isArray(payload.finalLanguages) ? payload.finalLanguages as string[] : [];
            const linkedinUrl = String(payload.linkedinUrl ?? "");

            const prompt = `
  You are an expert ATS resume writer and professional HTML designer.
  
  Your job is to generate a fully ATS-friendly resume in clean HTML.
  
  STRICT OUTPUT RULES:
  - Return ONLY the final HTML (no markdown, no backticks, no explanations)
  - Use ONLY inline CSS (no <style> tags, no external CSS)
  - Use semantic HTML tags: <main>, <section>, <h1>, <h2>, <p>, <ul>, <li>
  - Use professional fonts: Arial, Helvetica, sans-serif
  - Layout must be single-column and ATS-compliant
  - No tables, no images, no icons, no columns, no graphics, no text boxes
  - Do NOT use colors except black or dark gray
  - Section headings must be clear and simple (e.g., "Experience", "Skills")
  - Only include sections that contain real data
  - Keep formatting simple so ATS systems can parse easily
  
  ATS-FRIENDLY CONTENT RULES:
  - Use clear bullet points for achievements
  - Preserve the user’s wording but correct grammar and clarity
  - Do NOT fabricate any new information
  - Each experience entry must include: title, company, dates, and bullet points
  - Skills must be returned as a clean list (comma-separated or <ul>)
  - Projects should include name, description, and technologies used
  - Ensure that all text is directly readable (no nested div complexity)
  - Avoid decorative characters, emojis, or fancy symbols
  
  OUTPUT STRUCTURE:
  - Wrap everything inside a single <main> container with proper margins
  - Recommended order:
  1. Header (Name + Contact info)
  2. Summary
  3. Skills
  4. Experience
  5. Education
  6. Projects
  7. Certifications
  8. Languages
  9. Interests
  
  Your final output must be a clean, minimal, fully ATS-optimized HTML resume.
  
  ====================
  USER DATA
  ====================
  
  Name: ${fullName}
  Email: ${email}
  Phone: ${phone}
  Location: ${location}
  LinkedIn: ${linkedinUrl}
  
  Summary:
  ${summary}
  
  Education:
  ${finalEducation
                    .map((e) => `${String((e as Record<string, unknown>).degree ?? "")} - ${String((e as Record<string, unknown>).institute ?? "")} (${String((e as Record<string, unknown>).passingYear ?? "")})`)
                    .join("\n")}
  
  Skills:
  ${finalSkills.join(", ")}
  
  Certifications:
  ${finalCertifications.join(", ")}
  
  Experience:
    ${finalExperiences
                    .map((ex) => `${String((ex as Record<string, unknown>).position ?? "")} at ${String((ex as Record<string, unknown>).company ?? "")} (${String((ex as Record<string, unknown>).span ?? "")})`)
                    .join("\n")}
  
  Projects:
    ${finalProjects
                    .map((p) => `${String((p as Record<string, unknown>).name ?? "")} - ${String((p as Record<string, unknown>).description ?? "")}`)
                    .join("\n")}
  
  Languages:
  ${finalLanguages.join(", ")}
  
  Interests:
  ${finalInterests.join(", ")}
      `;

            const htmlOutput = await this.generateResume(prompt);
            console.log("Generated HTML Output:", htmlOutput);
            const cleanHTML = this.cleanHTMLOutput(htmlOutput);
            console.log('html',  cleanHTML)
            const file = { content: cleanHTML };
            const pdfBuffer = await (pdf as any).generatePdf(file, { format: "A4" });
            console.log('buffer', pdfBuffer)

            return {
                success: true,
                pdf: pdfBuffer,
                html: cleanHTML,
                provider: "openrouter"
            };
        } catch (error: unknown) {
            if (error instanceof Error) logger.error({ error }, "Error generating resume with gemini");
            else logger.error("Error generating resume with gemini");
            return { success: false, message: "Error generating resume, please try again later" };
        }

    }

    private async generateResume(prompt: string): Promise<string> {

        try {
            logger.info("Trying resume generation with Gemini...");
            const geminiHtml = await this.callGeminiForResume(prompt);
            logger.info("Successfully generated resume with Gemini");
            return geminiHtml;
        } catch (error: unknown) {
            if (error instanceof Error) logger.info({ error: error.message }, "Gemini failed, moving to OpenRouter free models:");
            else logger.info("Gemini failed, moving to OpenRouter free models:");
            try {
                logger.info("Trying resume generation with Grok...");
                const grokHtml = await this.callGrokForResume(prompt);
                logger.info("Successfully generated resume with Grok");
                return grokHtml;
            } catch (GrokError: unknown) {
                if (GrokError instanceof Error) logger.info({ error: GrokError.message }, "Grok failed, moving to OpenRouter free models:");
                else logger.info("Grok failed, moving to OpenRouter free models:");
            }
        }


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
                logger.info(`Trying resume generation with model: ${model}`);

                const response = await axios.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    {
                        model: model,
                        messages: [
                            {
                                role: "system",
                                content: "You are an expert resume writer and HTML developer. Generate ATS-compliant resumes in clean HTML format with inline CSS. Always return ONLY HTML code without any explanations, markdown, or additional text."
                            },
                            {
                                role: "user",
                                content: prompt
                            }
                        ],
                        max_tokens: 4000,
                        temperature: 0.3,
                        top_p: 0.9,
                        frequency_penalty: 0.2,
                        presence_penalty: 0.1
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${OPENROUTER_KEY}`,
                            "Content-Type": "application/json",
                            "HTTP-Referer": process.env.FRONTEND_ROUTE,
                            "X-Title": "CareerLink Resume Generator"
                        },
                    }
                );

                const htmlContent = response.data.choices?.[0]?.message?.content;

                if (!htmlContent) {
                    throw new Error("No HTML content in response");
                }

                logger.info(`Successfully generated resume with model: ${model}`);
                return htmlContent;
            } catch (error: unknown) {
                if (error instanceof Error) logger.info({ model, error: error.message }, "Model failed:");
                else logger.info({ model }, "Model failed:");
                continue;
            }
        }

        throw new Error("All OpenRouter models failed for resume generation");
    }

    private async callGeminiForResume(prompt: string): Promise<string> {
        const GEMINI_KEY = process.env.GEMINI_AI_API;
        if (!GEMINI_KEY) {
            throw new Error("GEMINI_AI_API key is not configured");
        }

        const genAI = new GoogleGenerativeAI(GEMINI_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-pro",
        });

        const result = await model.generateContent(prompt);
        const htmlOutput = result.response.text();
        return htmlOutput;
    }

    private async callGrokForResume(prompt: string): Promise<string> {
        const GROK_KEY = process.env.GROK_AI_API;

        const response = await axios.post(
            "https://api.x.ai/v1/chat/completions",
            {
                model: "grok-2-mini", // use grok-2-mini for free/trial usage
                messages: [
                    { role: "system", content: "You are an expert resume writer and HTML developer. Generate ATS-compliant resumes in clean HTML format with inline CSS. Always return ONLY HTML code without any explanations, markdown, or additional text." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 4000,
                temperature: 0.3,
                top_p: 0.9,
            },
            {
                headers: {
                    "Authorization": `Bearer ${GROK_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const htmlContent = response.data.choices?.[0]?.message?.content;
        if (!htmlContent) throw new Error("No HTML content returned from Grok");

        return htmlContent;
    }

    private cleanHTMLOutput(htmlOutput: string): string {
        // Remove markdown code blocks if present
        let cleaned = htmlOutput.replace(/```html\s*/gi, "")
            .replace(/```\s*/g, "")
            .replace(/```html/g, "")
            .trim();

        // Ensure it's wrapped in main tag if not already
        if (!cleaned.includes("<main")) {
            cleaned = `<main style="margin: 20px; font-family: Arial, Helvetica, sans-serif; color: #000;">\n${cleaned}\n</main>`;
        }

        return cleaned;
    }

}