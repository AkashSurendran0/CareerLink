import { ICreateResume } from "../domain/services/IResumeServices";
import { injectable, inject } from "inversify";
import dotenv from 'dotenv'
import pdf from 'html-pdf-node'

dotenv.config()

@injectable()
export class CreateResume implements ICreateResume {

    async createResume(data: any): Promise<any> {
        console.log(data)
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
Return only **complete HTML** markup. Do not include markdown, code fences, or any explanations.
Using the following structured information, generate a modern, visually appealing HTML resume with inline CSS styling.

Requirements:
- Include sections only if they contain data: Summary, Education, Skills, Certifications, Experience, Projects, Languages, Interests.
- Use semantic HTML tags (<section>, <h2>, <ul>, <li>, <p>, etc.) for structure.
- Add inline CSS styling for a clean and professional look.
- Ensure proper spacing, margins, and section separation for easy readability.
- Use a neutral color palette (black, gray, blue highlights).
- Use clear fonts (e.g., Arial, Helvetica, sans-serif).
- Make section headings stand out with subtle borders or highlights.
- Keep the design ATS-friendly (no tables, no images).
- Do not add fake or placeholder information — only use the provided data.

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
  (p) => `${p.title} - ${p.description}`
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