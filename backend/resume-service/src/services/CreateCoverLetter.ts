import { injectable } from "inversify";
import { ICreateCoverLetter } from "../domain/services/IResumeServices";
import dotenv from 'dotenv'
import {GoogleGenerativeAI} from '@google/generative-ai'

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
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_API);
      
            const model = genAI.getGenerativeModel({ 
                    model: "gemini-1.5-flash",
            });

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
  .map((ex) => `${ex.position} (${ex.span})`)
  .join(", ")}
Skills: ${finalSkills.join(", ")}
Certifications: ${finalCertifications.join(", ")}
Why interested in the company: ${finalInterests.join(", ")}

Generate a polished, compelling cover letter using only the information above.

`
        const result = await model.generateContent(prompt);
        const content= result.response.text(); 

        return {success:true, content}

        } catch (error) {
            console.log('Error generating cover letter with gemini', error)
            throw error
        }
    }

}