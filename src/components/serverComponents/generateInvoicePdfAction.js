// app/actions/invoice.js
"use server";

import { invoiceTemplate } from "@/utils/invoiceTemplate";
import puppeteer from "puppeteer"; // Ensure puppeteer is installed: npm install puppeteer

/**
 * Generates a basic invoice PDF using Puppeteer.
 * This function runs only on the server.
 * @returns {Promise<Buffer>} A Promise that resolves to the PDF content as a Node.js Buffer.
 * @throws {Error} If PDF generation fails.
 */
export async function generateInvoicePdfAction(
  username,
  crafterId,
  songGenre,
  musicTemplate,
  price,
  crafterEmail,
  crafterPhone,
  createdAt
) {
  let browser; // Declare browser outside try for finally block access
  try {
    // Launch a headless Chromium browser
    // args are often needed for deployment on serverless platforms like Vercel
    if (
      !username ||
      !crafterId ||
      !songGenre ||
      !musicTemplate ||
      !price ||
      !createdAt ||
      !crafterPhone ||
      !createdAt
    ) {
      throw new Error("Missing required data for invoice generation");
    }
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true, // Run in headless mode (no visible browser UI)
    });
    const page = await browser.newPage();

    // Basic HTML content for the invoice
    // const invoiceHtml = `
    //   <div style="font-family: 'Inter', sans-serif; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 600px; margin: 20px auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    //     <h1 style="color: #333; text-align: center; margin-bottom: 20px;">Invoice</h1>
    //     <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 20px;">
    //     <p style="font-size: 1.1em; color: #555;">
    //       <strong>Invoice Date:</strong> <span style="float: right;">${new Date().toLocaleDateString()}</span>
    //     </p>
    //     <p style="font-size: 1.1em; color: #555;">
    //       <strong>Service Provided:</strong> <span style="float: right;">Web Development Consultation</span>
    //     </p>
    //     <p style="font-size: 1.1em; color: #555;">
    //       <strong>Amount Due:</strong> <span style="float: right; font-weight: bold; color: #0070f3;">$500.00</span>
    //     </p>
    //     <hr style="border: none; border-top: 1px dashed #ccc; margin-top: 30px; margin-bottom: 20px;">
    //     <p style="font-size: 0.9em; color: #777; text-align: center;">Thank you for your business!</p>
    //   </div>
    // `;
    const invoiceHtml = invoiceTemplate(
      username,
      crafterId,
      songGenre,
      musicTemplate,
      price,
      crafterEmail,
      crafterPhone
    );

    // Set the page content and wait for network to be idle
    await page.setContent(invoiceHtml, { waitUntil: "networkidle0" });

    // Generate the PDF as a Buffer
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // Include background colors/images
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    });

    return pdfBuffer; // Return the Buffer directly
  } catch (error) {
    console.error("Error generating PDF in Server Action:", error);
    // In a Server Action, throw an error that the client can catch
    throw new Error(`Failed to generate invoice PDF: ${error.message}`);
  } finally {
    // Ensure the browser is closed even if an error occurs
    if (browser) {
      await browser.close();
    }
  }
}
