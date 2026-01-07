import { injectable } from "inversify";
import { ICreateTailoredCoverLetter } from "../domain/services/IResumeServices";
import {GoogleGenerativeAI} from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";
import { logger } from "../utils/logger";

dotenv.config();

@injectable()
export class CreateTailoredCoverLetter implements ICreateTailoredCoverLetter {

    async createTailoredCoverLetter(job: Record<string, unknown>, details: Record<string, unknown>, user: Record<string, unknown>): Promise<unknown> {
        try {
            const jobRec = job as Record<string, unknown>;
            const detailsRec = details as Record<string, unknown>;
            const userRec = user as Record<string, unknown>;

            const jobTitle = String(jobRec.jobTitle ?? "");
            const companyName = String(jobRec.companyName ?? "");
            const location = String(jobRec.location ?? "");
            const jobDescription = String(jobRec.jobDescription ?? "");
            const qualifications = Array.isArray(jobRec.qualifications) ? jobRec.qualifications as string[] : [];
            const responsibilities = Array.isArray(jobRec.responsibilities) ? jobRec.responsibilities as string[] : [];
            const experienceLevel = String(jobRec.experienceLevel ?? "");

            const username = String(userRec.username ?? "");
            const email = String(userRec.email ?? "");

            const aboutMe = String(detailsRec.aboutMe ?? "");
            const userLocation = String(detailsRec.location ?? "");
            const proficiency = String(detailsRec.proficiency ?? "");
            const skills = Array.isArray(detailsRec.skills) ? detailsRec.skills as string[] : [];
            const education = Array.isArray(detailsRec.education) ? detailsRec.education as Array<Record<string, unknown>> : [];
            const experience = Array.isArray(detailsRec.experience) ? detailsRec.experience as Array<Record<string, unknown>> : [];
            const linkedinLink = String(detailsRec.linkedinLink ?? "");
            const githubLink = String(detailsRec.githubLink ?? "");

            const prompt = `
            You are an expert cover-letter writer specializing in ATS-friendly, job-specific letters.
    Generate a fully tailored cover letter strictly based on the job description and user details provided below.
    
    ====================================================
    OUTPUT RULES
    - Return ONLY the final cover letter text (no HTML unless I ask)
    - No markdown, no backticks, no commentary
    - Tone must be professional, concise, confident
    - Do NOT invent new experience, skills, projects, or achievements
    - Use the user’s real details ONLY
    - Personalize everything to the job description
    - Keep it 3–5 short paragraphs (max 350 words)
    - Avoid repetition and buzzword stuffing
    
    ====================================================
    INPUT DATA (USE ONLY THESE)
    JOB DETAILS
    
    Job Title: ${jobTitle}
    Company: ${companyName}
    Location: ${location}
    Description: ${jobDescription}
    Qualifications: ${qualifications.join(", ")}
    Responsibilities: ${responsibilities.join(", ")}
    Experience Level: ${experienceLevel}
    
    USER CORE INFO
    
    Name: ${username}
    Email: ${email}
    
    USER DETAILS
    
    About Me: ${aboutMe}
    Location: ${userLocation}
    Proficiency: ${proficiency}
    Skills: ${skills.join(", ")}
    Education:
    ${education.map((e) => `${String(e.degree ?? "")} - ${String(e.university ?? "")} (${String(e.passingYear ?? "")})`).join("\n")}
    Experience:
    ${experience.map((ex) => `${String(ex.position ?? "")} at ${String(ex.company ?? "")} (${String(ex.experience ?? "")} year(s))`).join("\n")}
    LinkedIn: ${linkedinLink}
    GitHub: ${githubLink}
    
    ====================================================
    TAILORING RULE
    - Match the language of the job description (skills, tools, responsibilities).
    - Highlight the user’s most relevant skills and experience FIRST.
    - Show alignment with the role’s expectations and the company’s needs.
    - Reference the user's relevant achievements WITHOUT inventing facts.
    - Make it sound naturally personalized, not generic.
    - End with a confident closing and willingness to discuss further.
    
    ====================================================
    FINAL REQUIREMENT
    
    Return ONLY the finished tailored cover letter text.
    No markdown.
    No extra comments.
    No surrounding quotes.
            `;
    
            const content = await this.callOpenRouter(prompt);
    
            return { 
                success: true, 
                content: content,
                provider: "openrouter" 
            };
        } catch (error: unknown) {
            if (error instanceof Error) logger.error("OpenRouter failed, trying fallback...", error.message);
            else logger.error("OpenRouter failed, trying fallback...");
            return {
                success: false,
                message: "Error generating cover letter, please try again later"
            };
        }
    }

    private async callOpenRouter (prompt:string): Promise<string> {
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

        for(const model of freeModels){
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
                if (modelError instanceof Error) logger.error(`Model ${model} failed:`, modelError.message);
                else logger.error(`Model ${model} failed:`);
                continue; // Try next model
            }
        }

        throw new Error("All OpenRouter free models failed");
    }

}