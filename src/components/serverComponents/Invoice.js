"use server";

import puppeteer from "puppeteer";

export async function invoiceAction() {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true, // Run in headless mode
    });
    const page = await browser.newPage();

    // Basic HTML for the invoice
    const invoiceHtml = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1>Invoice</h1>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Item:</strong> Basic Service</p>
          <p><strong>Amount:</strong> $100.00</p>
        </div>
      `;

    await page.setContent(invoiceHtml, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true }); // Get PDF as a Buffer

    await browser.close();

    // Return the PDF buffer directly. Next.js will handle serialization.
    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    // In a server action, you typically throw an error or return an object
    // indicating failure, which the client can then handle.
    throw new Error("Failed to generate invoice PDF.");
  }
}
