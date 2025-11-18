import { ICreateResume } from "../domain/services/IResumeServices";
import { injectable, inject } from "inversify";
import dotenv from 'dotenv'
import pdf from 'html-pdf-node'

dotenv.config()

@injectable()
export class CreateResume implements ICreateResume {

    async createResume(data: any): Promise<any> {
        const {
            fullName,
            email,
            phone,
            location,
            summary,
            finalEducation,
            finalSkills,
            finalCertifications,
            finalExperiences,
            finalProjects,
            finalInterests,
            finalLanguages,
            linkedinUrl,
        } = data;

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
You are an expert resume writer and HTML designer.
Return only the final HTML markup — no markdown, no code fences, and no explanations.
Using the structured data provided, generate a modern, ATS-friendly HTML resume with inline CSS.

Rules & Requirements:

1. Include sections only if they contain data:
- Summary
- Education
- Skills
- Certifications
- Experience
- Projects
- Languages
- Interests

2. Styling Requirements (inline CSS only):
- Use a clean, modern, minimal layout
- Neutral color palette: black/gray with subtle blue highlights
- Professional fonts: Arial, Helvetica, sans-serif
- Clear spacing between sections
- Section titles must be visually distinct (bold + underline or border-bottom)
- No images, no tables, no complex layouts (ensure ATS compatibility)

3. HTML Structure Rules:
- Use semantic tags: <section>, <h2>, <p>, <ul>, <li>, etc.
- Wrap the entire resume in a single main container <div> with proper margins
- Make the design readable on both PDF and browser exports

4. Content Rules:
- Use only the provided data — never invent information
- Preserve user wording but fix spelling/grammar professionally
- Display items in clean bullet lists where appropriate
- Skip empty or null fields entirely

5. Output Rules:
- Return only the complete HTML document
- No markdown
- No backticks
- No additional commentary

Here is the user data:
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Location: ${location}
LinkedIn: ${linkedinUrl}

Summary:
${summary}

Education:
${finalEducation.map(
  (e) => `${e.degree} - ${e.institute} (${e.passingYear})`
).join("\n")}

Skills:
${finalSkills.join(", ")}

Certifications:
${finalCertifications.join(", ")}

Experience:
${finalExperiences.map(
  (ex) => `${ex.position} at ${ex.company} (${ex.span})`
).join("\n")}

Projects:
${finalProjects.map(
  (p) => `${p.name} - ${p.description}`
).join("\n")}

Languages:
${finalLanguages.join(", ")}

Interests:
${finalInterests.join(", ")}
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

        return {pdf:pdfBuffer, html:html}
    } catch (error: any) {
        console.log('Error generating resume with gemini', error)
        throw error
    }
    }

}