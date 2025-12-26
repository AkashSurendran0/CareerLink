import { injectable } from "inversify";
import { ICreateTailoredCoverLetter } from "../domain/services/IResumeServices";
import {GoogleGenerativeAI} from '@google/generative-ai'
import dotenv from 'dotenv'
import axios from "axios";

dotenv.config()

@injectable()
export class CreateTailoredCoverLetter implements ICreateTailoredCoverLetter {

    async createTailoredCoverLetter(job: any, details: any, user: any): Promise<any> {
        try {
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
    ${details.education.map(e => `${e.degree} - ${e.university} (${e.passingYear})`).join("\n")}
    Experience:
    ${details.experience.map(ex => `${ex.position} at ${ex.company} (${ex.experience} year(s))`).join("\n")}
    LinkedIn: ${details.linkedinLink}
    GitHub: ${details.githubLink}
    
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
            `
    
            const content = await this.callOpenRouter(prompt)
    
            return { 
                success: true, 
                content: content,
                provider: 'openrouter' 
            };
        } catch (error: any) {
            console.log('OpenRouter failed, trying fallback...', error.message);
            return {
                success: false,
                message: 'Error generating cover letter, please try again later'
            };
        }
    }

    private async callOpenRouter (prompt:string): Promise<string> {
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

        for(const model of freeModels){
            try {
                console.log(`Trying OpenRouter model: ${model}`);

                const response = await axios.post(
                    'https://openrouter.ai/api/v1/chat/completions',
                    {
                        model: model,
                        messages: [
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        max_tokens: 1000,
                        temperature: 0.7
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${OPENROUTER_KEY}`,
                            'Content-Type': 'application/json',
                            'HTTP-Referer': 'http://localhost:3000', // Required by OpenRouter
                            'X-Title': 'CareerLink Cover Letter Generator' // Optional but good
                        },
                        timeout: 30000 // 30 seconds
                    }
                )

                if (response.data?.choices?.[0]?.message?.content) {
                    console.log(`Success with model: ${model}`);
                    return response.data.choices[0].message.content;
                }

            } catch (modelError:any) {
                console.log(`Model ${model} failed:`, modelError.message);
                continue; // Try next model
            }
        }

        throw new Error('All OpenRouter free models failed');
    }

}