import { ICreateResume } from "../domain/services/IResumeServices";
import { injectable, inject } from "inversify";
import dotenv from 'dotenv'
import pdf from 'html-pdf-node'
import {GoogleGenerativeAI} from '@google/generative-ai'

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

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_API);
      
        const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash",
        });

        const prompt = `
You are an expert ATS resume writer and professional HTML designer.

Your job is to generate a fully ATS-friendly resume in clean HTML.

STRICT OUTPUT RULES:
- Return ONLY the final HTML (no markdown, no backticks, no explanations)
- Use ONLY inline CSS (no <style> tags, no external CSS)
- Use semantic HTML tags: <main>, <section>, <h1>, <h2>, <p>, <ul>, <li>
- Use professional fonts: Arial, Helvetica, sans-serif
- Layout must be single-column and ATS-compliant
- No tables, no images, no icons, no columns, no graphics, no text boxes
- Do NOT use colors except black or dark gray
- Section headings must be clear and simple (e.g., "Experience", "Skills")
- Only include sections that contain real data
- Keep formatting simple so ATS systems can parse easily

ATS-FRIENDLY CONTENT RULES:
- Use clear bullet points for achievements
- Preserve the user’s wording but correct grammar and clarity
- Do NOT fabricate any new information
- Each experience entry must include: title, company, dates, and bullet points
- Skills must be returned as a clean list (comma-separated or <ul>)
- Projects should include name, description, and technologies used
- Ensure that all text is directly readable (no nested div complexity)
- Avoid decorative characters, emojis, or fancy symbols

OUTPUT STRUCTURE:
- Wrap everything inside a single <main> container with proper margins
- Recommended order:
  1. Header (Name + Contact info)
  2. Summary
  3. Skills
  4. Experience
  5. Education
  6. Projects
  7. Certifications
  8. Languages
  9. Interests

Your final output must be a clean, minimal, fully ATS-optimized HTML resume.

====================
USER DATA
====================

Name: ${fullName}
Email: ${email}
Phone: ${phone}
Location: ${location}
LinkedIn: ${linkedinUrl}

Summary:
${summary}

Education:
${finalEducation
  .map((e) => `${e.degree} - ${e.institute} (${e.passingYear})`)
  .join("\n")}

Skills:
${finalSkills.join(", ")}

Certifications:
${finalCertifications.join(", ")}

Experience:
${finalExperiences
  .map((ex) => `${ex.position} at ${ex.company} (${ex.span})`)
  .join("\n")}

Projects:
${finalProjects
  .map((p) => `${p.name} - ${p.description}`)
  .join("\n")}

Languages:
${finalLanguages.join(", ")}

Interests:
${finalInterests.join(", ")}
`;

        const result = await model.generateContent(prompt);
        const htmlOutput = result.response.text(); 

        const cleanHTML = htmlOutput.replace(/```html|```/g, "").trim();

        const file = { content: cleanHTML };
        const pdfBuffer = await pdf.generatePdf(file, { format: "A4" });

        return {
            success:true,
            pdf: pdfBuffer,
            html: cleanHTML,
        };
    } catch (error: any) {
        console.log('Error generating resume with gemini', error)
        throw error
    }
    }

}