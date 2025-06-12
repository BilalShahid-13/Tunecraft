"use client";

import { generateInvoicePdfAction } from "@/components/serverComponents/generateInvoicePdfAction";

export default function Invoice() {
  const handleDownloadInvoice = async () => {
    try {
      // Call the server action to get the PDF buffer
      const pdfBuffer = await generateInvoicePdfAction();

      if (!pdfBuffer) {
        throw new Error("No PDF data received from server.");
      }

      // Convert the ArrayBuffer (which Next.js sends from a Node.js Buffer) to a Blob
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice.pdf'; // Suggested filename
      document.body.appendChild(a); // Append to body (required for Firefox)
      a.click(); // Programmatically click the link

      // Clean up the temporary URL and element
      window.URL.revokeObjectURL(url);
      a.remove();

    } catch (error) {
      console.error('Download failed:', error);
      // Use a custom modal or toast notification instead of alert() in production apps
      alert(`Failed to download invoice: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <>
      <div style={{ padding: 20 }}>
        <button
          onClick={handleDownloadInvoice}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Download PDF
        </button>
      </div>
    </>
  )
}
