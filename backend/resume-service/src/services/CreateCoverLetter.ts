import { injectable } from "inversify";
import { ICreateCoverLetter } from "../domain/services/IResumeServices";
import dotenv from 'dotenv'

dotenv.config()

@injectable()
export class CreateCoverLetter implements ICreateCoverLetter {

    async createCoverLetter (data:any) {
        const {
            fullName,
            companyName,
            position,
            hrName,
            finalEducation,
            finalExperiences,
            finalSkills,
            finalCertifications,
            finalInterests
        }=data

        try {
            const response=await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent",
            {
                method:'POST',
                headers:{
                    "Content-type":"application/json",
                    "x-goog-api-key":process.env.GEMINI_AI_API!
                },
                body: JSON.stringify({
                    contents:[
                        {
                            parts:[{
                                text:
                                `
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
  .map((ex) => `${ex.position} (${ex.span})`)
  .join(", ")}
Skills: ${finalSkills.join(", ")}
Certifications: ${finalCertifications.join(", ")}
Why interested in the company: ${finalInterests.join(", ")}

Generate a polished, compelling cover letter using only the information above.

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
        let content=data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "<p>Error generating cover letter</p>";

        return {content}

        } catch (error) {
            
        }
    }

}