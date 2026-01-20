import puppeteer from "puppeteer";

export async function generatePdfFromHtml(html: string): Promise<Buffer> {
    const launchOptions: Parameters<typeof puppeteer.launch>[0] = {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };

    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
        launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    }

    const browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "a4", // 👈 fixed below
        printBackground: true,
    });

    await browser.close();
    return pdfBuffer;
}
