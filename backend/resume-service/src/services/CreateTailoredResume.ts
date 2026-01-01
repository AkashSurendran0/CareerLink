import { injectable } from "inversify";
import { ICreateTailoredResume } from "../domain/services/IResumeServices";
import dotenv from 'dotenv'
import pdf from 'html-pdf-node'
import {GoogleGenerativeAI} from '@google/generative-ai'
import axios from "axios";
import { logger } from "../utils/logger";

dotenv.config()

@injectable()
export class CreateTailoredResume implements ICreateTailoredResume {

    async createTailoredResume(job: any, details: any, user:any): Promise<any> {
        try {
            const prompt = `
    You are an expert ATS-compliant resume writer and professional HTML designer.
    Generate a fully tailored resume in clean HTML, optimized strictly for the provided job description and user details.
    
    ====================================================
    OUTPUT RULES (EXTREMELY IMPORTANT)
    
    - Return ONLY the final HTML (no markdown, no backticks, no commentary)
    - Must be a valid, complete HTML document
    - Inline CSS only (no <style> tags, no external CSS)
    - Use only black or dark gray text
    - Use Arial, Helvetica, sans-serif
    - STRICT single-column layout
    - NO tables, NO images, NO icons, NO multi-column layouts
    - Use semantic tags (<main>, <section>, <h1>, <h2>, <p>, <ul>, <li>)
    - Section headers must be simple and ATS-friendly
    - All text must be directly readable by ATS systems
    
    ====================================================
    INPUT DATA (USE ONLY THESE)
    JOB DETAILS
    
    Job Title: ${job.jobTitle}
    Company: ${job.companyName ?? ""}
    Location: ${job.location}
    Description: ${job.jobDescription}
    Qualifications: ${job.qualifications.join(", ")}
    Responsibilities: ${job.responsibilities.join(", ")}
    Experience Level: ${job.experienceLevel}
    
    USER CORE INFO
    
    Name: ${user.username}
    Email: ${user.email}
    
    USER DETAILS
    
    About Me: ${details.aboutMe}
    Location: ${details.location}
    Proficiency: ${details.proficiency}
    Skills: ${details.skills.join(", ")}
    Education:
    ${details.education.map( (e) => `${e.degree} - ${e.university} (${e.passingYear})` ).join("\n")}
    Experience:
    ${details.experience.map( (ex) => `${ex.position} at ${ex.company} (${ex.experience} year(s))` ).join("\n")}
    LinkedIn: ${details.linkedinLink}
    GitHub: ${details.githubLink}
    
    ====================================================
    HALLUCINATION / EMPTY FIELD RULES (CRITICAL)
    
    - Do NOT invent or infer any skills, experience, education, projects, dates, or certifications that are not present in the input data.
    - If a field is empty, missing, or contains only empty strings, omit that section entirely from the resume.
    - Treat arrays that contain only empty strings or null values as empty (i.e., omit).
    - Do not populate a Skills section with generic or assumed skills if the user provided none.
    - If the entire user profile contains no usable data (no name, no email, and no content), return a minimal HTML document with a header showing available core info (if any) and a single paragraph: "No resume data provided."
    
    ====================================================
    TAILORING RULES
    
    - Prioritize job-required skills FIRST in the skills section (reorder, do not invent).
    - Rewrite summary to directly match the job’s expectations and terminology.
    - Reorder experiences so the most relevant ones appear first.
    - Rewrite experience bullet points to align with the job description but WITHOUT inventing fake achievements.
    - Correct spelling of skills (e.g., “Nodejs” → “Node.js”).
    - Match synonyms to job language (e.g., “React” → “React.js”, “Microservices” → “Microservices Architecture”).
    - Keep irrelevant details low-priority but DO NOT remove them.
    
    ====================================================
    HTML STRUCTURE (STRICT)
    
    The resume must follow this order ONLY if data exists:
    - Header (Name, Email, Location, Links)
    - Summary
    - Skills
    - Experience
    - Education
    - Projects
    - Certifications
    - Languages
    - Interests
    Wrap everything inside:
    
    <main style="margin: 20px; font-family: Arial, Helvetica, sans-serif; color: #000;">
    ====================================================
    FINAL REQUIREMENT
    
    Return ONLY the final HTML document.
    No markdown.
    No explanations.
    No additional text.
            ` 

            const htmlOutput=await this.generateResume(prompt)
            const cleanHTML=this.cleanHTMLOutput(htmlOutput)

            const file = { content: cleanHTML };
            const pdfBuffer = await pdf.generatePdf(file, { format: "A4" });

            return {
                success: true,
                pdf: pdfBuffer,
                html: cleanHTML,
                provider: 'openrouter'
            };

        } catch (error: any) {
            logger.error('Error generating resume with gemini', error)
            return {success:false, message:'Error generating resume, please try again later'}
        }
        
    }

    private async generateResume (prompt:string): Promise<string> {

        try {
            logger.info('Trying resume generation with Gemini...');
            const geminiHtml=await this.callGeminiForResume(prompt)
            logger.info('Successfully generated resume with Gemini');
            return geminiHtml
        } catch (error: any) {
            logger.info('Gemini failed, moving to OpenRouter free models:', error.message);
            try {
                logger.info('Trying resume generation with Grok...');
                const grokHtml = await this.callGrokForResume(prompt);
                logger.info('Successfully generated resume with Grok');
                return grokHtml;
            } catch (GrokError: any) {
                logger.error('Grok failed, moving to OpenRouter free models:', GrokError.message);
            }
        }


        const OPENROUTER_KEY = process.env.OPENROUTER_AI_API

        const freeModels = [
            'google/gemini-2.0-flash-exp:free',
            'google/gemma-3-27b-it:free',
            'google/gemma-3-12b-it:free',
            'qwen/qwen3-coder:free',
            'qwen/qwen3-coder:free',
            'mistralai/mistral-small-3.1-24b-instruct:free',
            'meta-llama/llama-3.1-405b-instruct:free'
        ]

        for(const model of freeModels) {
            try {
                logger.info(`Trying resume generation with model: ${model}`);

                const response = await axios.post(
                    'https://openrouter.ai/api/v1/chat/completions',
                    {
                        model: model,
                        messages: [
                            {
                                role: 'system',
                                content: 'You are an expert resume writer and HTML developer. Generate ATS-compliant resumes in clean HTML format with inline CSS. Always return ONLY HTML code without any explanations, markdown, or additional text.'
                            },
                            {
                                role: 'user',
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
                            'Authorization': `Bearer ${OPENROUTER_KEY}`,
                            'Content-Type': 'application/json',
                            'HTTP-Referer': process.env.FRONTEND_ROUTE,
                            'X-Title': 'CareerLink Resume Generator'
                        },
                    }
                );

                const htmlContent = response.data.choices?.[0]?.message?.content;
                
                if (!htmlContent) {
                    throw new Error('No HTML content in response');
                }

                logger.info(`Successfully generated resume with model: ${model}`);
                return htmlContent;
            } catch (error: any) {
                logger.error(`Model ${model} failed:`, error.message);
                continue;
            }
        }

        throw new Error('All OpenRouter models failed for resume generation');
    }

    private async callGeminiForResume (prompt:string): Promise<string> {
        const GEMINI_KEY = process.env.GEMINI_AI_API

        const genAI = new GoogleGenerativeAI(GEMINI_KEY);
      
        const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-pro",
        });

        const result = await model.generateContent(prompt);
        const htmlOutput = result.response.text(); 
        return htmlOutput
    }

    private async callGrokForResume(prompt:string): Promise<string> {
        const GROK_KEY = process.env.GROK_AI_API;

        const response = await axios.post(
            'https://api.x.ai/v1/chat/completions',
            {
                model: "grok-2-mini", // use grok-2-mini for free/trial usage
                messages: [
                    { role: 'system', content: 'You are an expert resume writer and HTML developer. Generate ATS-compliant resumes in clean HTML format with inline CSS. Always return ONLY HTML code without any explanations, markdown, or additional text.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 4000,
                temperature: 0.3,
                top_p: 0.9,
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROK_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        const htmlContent = response.data.choices?.[0]?.message?.content;
        if (!htmlContent) throw new Error("No HTML content returned from Grok");

        return htmlContent;
    }

    private cleanHTMLOutput(htmlOutput: string): string {
        // Remove markdown code blocks if present
        let cleaned = htmlOutput.replace(/```html\s*/gi, '')
                               .replace(/```\s*/g, '')
                               .replace(/```html/g, '')
                               .trim();
        
        // Ensure it's wrapped in main tag if not already
        if (!cleaned.includes('<main')) {
            cleaned = `<main style="margin: 20px; font-family: Arial, Helvetica, sans-serif; color: #000;">\n${cleaned}\n</main>`;
        }
        
        return cleaned;
    }

}