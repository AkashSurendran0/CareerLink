import { injectable } from "inversify";
import { ICreateTailoredResume } from "../domain/services/IResumeServices";
import dotenv from 'dotenv'
import pdf from 'html-pdf-node'
import {GoogleGenerativeAI} from '@google/generative-ai'

dotenv.config()

@injectable()
export class CreateTailoredResume implements ICreateTailoredResume {

    async createTailoredResume(job: any, details: any, user:any): Promise<any> {
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_API);
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-pro",
            });
 
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

            const result = await model.generateContent(prompt);
            const htmlOutput = result.response.text(); 
    
            const cleanHTML = htmlOutput.replace(/```html|```/g, "").trim();
    
            const file = { content: cleanHTML };
            const pdfBuffer = await pdf.generatePdf(file, { format: "A4" });
     
            return {
                success:true,
                pdf: pdfBuffer,
                html: cleanHTML,
            }
        } catch (error: any) {
            console.log('Error generating resume with gemini', error)
            return {success:false, message:'Error generating resume, please try again later'}
        }
    }

}