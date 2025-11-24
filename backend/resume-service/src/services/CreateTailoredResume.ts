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
            const response=await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
                {
                    method:'POST',
                    headers:{
                        "Content-type":"application/json",
                        "x-goog-api-key":process.env.GEMINI_AI_API!
                    },
                    body:JSON.stringify({
                        contents:[
                            {
                                parts:[{
                                    text:
                                    `
You are an expert ATS-friendly resume writer and professional HTML designer.
Your task is to generate a fully tailored resume in HTML, optimized specifically for the job description provided.

STRICT OUTPUT RULES:
- Return ONLY the final HTML document.
- No markdown, no backticks, no commentary.
- HTML must be clean, ATS-friendly, and easy to parse.
- Inline CSS only (no <style> tag, no external files).
- Professional fonts: Arial, Helvetica, sans-serif.
- Only black/gray tones.
- No tables, images, icons, or multi-column layouts.

====================================================
       INPUT DATA (USE *ONLY* THESE DETAILS)
====================================================

### JOB DETAILS
Job Title: ${job.jobTitle}
Company: ${job.companyName ?? ""}
Location: ${job.location}
Description: ${job.jobDescription}
Qualifications: ${job.qualifications.join(", ")}
Responsibilities: ${job.responsibilities.join(", ")}
Experience Level: ${job.experienceLevel}

### USER CORE DETAILS  
email: ${user.email}
name: ${user.username}

### USER DETAILS
Profile Picture: ${details.profilePicture} (DO NOT USE IN HTML)
About Me: ${details.aboutMe}
Location: ${details.location}
Proficiency: ${details.proficiency}
Skills: ${details.skills.join(", ")}
Education:
${details.education.map(
  (e) => `${e.degree} - ${e.university} (${e.passingYear})`
).join("\n")}
Experience:
${details.experience.map(
  (ex) => `${ex.position} at ${ex.company} (${ex.experience} year(s))`
).join("\n")}
LinkedIn: ${details.linkedinLink}
GitHub: ${details.githubLink}

====================================================
       TAILORING & PRIORITIZATION RULES
====================================================

1. **Give highest priority to skills, tools, and technologies mentioned in the job description.**  
If the details has them, list those FIRST in the Skills section.

2. **Reorder the details’s experiences so that the most relevant ones (based on job responsibilities & qualifications) appear at the top.**

3. **Rewrite the Summary to strongly match the job requirements**, highlighting:
- Required technical skills  
- Relevant experience  
- Relevant achievements  
- Alignment with job responsibilities  

4. **Rewrite experience bullet points to align naturally with job expectations**, but WITHOUT inventing new information.

5. **Skills Enhancement Rule**  
If the details has misspelled skills (e.g., “doker”), correct it (“Docker”).

6. **Synonym Matching Rule**  
If job description mentions equivalent terms, adjust phrasing to match job terminology.  
Examples:  
- “React” → “React.js”  
- “Nodejs” → “Node.js”  
- “Microservices” → “Microservices Architecture”

7. **Omit any details details not relevant to the job.**  
Example: if a details's old job is irrelevant and unrelated, keep it but do NOT emphasize it.

====================================================
       HTML STRUCTURE RULES
====================================================

Sections to include (ONLY if data exists):
- Summary
- Skills
- Experience
- Education
- Certifications
- Projects
- Languages
- Interests

HTML MUST FOLLOW:
- Full valid HTML document
- Wrapped in one main <div style="margin: 20px;">
- Section titles: bold + underline OR bottom border
- Use <section>, <h2>, <p>, <ul>, <li> for layout
- Bullet lists for experience, skills, education, projects

====================================================
       CONTENT CONSTRAINTS
====================================================

- DO NOT invent new jobs, projects, or skills.
- DO NOT assume achievements or responsibilities not provided.
- DO NOT include the profile picture.
- DO NOT add personal details beyond what is given.
- DO NOT reword information to change meaning — only optimize clarity.

====================================================
       FINAL OUTPUT REQUIREMENT
====================================================

Return ONLY the final HTML document.
No markdown.
No explanations.
No additional text.

                                    `
                                }]
                            }
                        ],
                        generationConfig:{
                            temperature:0.4,
                            maxOutputTokens:5000
                        }
                    })
                }
            )

            const data=await response.json()
            let html=data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "<p>Error generating resume</p>";
            html=html.replace(/```html|```/g, "").trim();
            
            const file={content:html}
            const pdfBuffer=await pdf.generatePdf(file, {format:"A4"})
            
            return {success:true, pdf:pdfBuffer, html:html}
        } catch (error: any) {
            console.log('Error generating resume with gemini', error)
            throw error
        }
    }

}