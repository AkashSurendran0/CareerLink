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
You are an expert cover-letter writer.
Return only the final cover-letter text — no explanations, no markdown, and no code fences.

Requirements:
- Start with a proper salutation:
  - If hrName exists: use "Dear ${hrName},"
  - If hrName is empty/null: use "Dear Hiring Manager,"
- The letter must be professional, concise, and tailored to the job.
- Use the provided details naturally within the content.
- Do not add any data that is not provided.
- If a field is empty (certifications, interests, etc.), skip it entirely.
- The structure should be:
  1. Salutation
  2. Intro paragraph stating interest in the role and company
  3. Skills & education paragraph
  4. Experience paragraph
  5. Closing paragraph expressing enthusiasm
  6. Professional closing (e.g., "Sincerely, [Name]")

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