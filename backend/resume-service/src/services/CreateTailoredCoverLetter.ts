import { injectable } from "inversify";
import { ICreateTailoredCoverLetter } from "../domain/services/IResumeServices";
import {GoogleGenerativeAI} from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

@injectable()
export class CreateTailoredCoverLetter implements ICreateTailoredCoverLetter {

    async createTailoredCoverLetter(job: any, details: any, user: any): Promise<any> {
        try {
            const genAI=new GoogleGenerativeAI(process.env.GEMINI_AI_API)
            const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash",
            });

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
            const result = await model.generateContent(prompt);
            const content=result.response.text()

            return {success:true, content}

        } catch (error: any) {
            console.log('Error generating cover letter with gemini', error)
            return {success:false, message:'Error generating cover letter, please try again later'}
        }
    }

}