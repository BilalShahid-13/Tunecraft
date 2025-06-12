"use server";

import { adminRevisionRequested } from "@/lib/emailTemplates";
import { sendMail } from "@/utils/emailService";

export default async function crafterRevision(
  orderId,
  crafterId,
  role,
  crafterName,
  crafterEmail,
  taskName,
  adminFeedback
) {
  if (!orderId || !crafterId || !role) {
    return NextResponse.json(
      { error: "orderId, crafterId, and role are required" },
      { status: 400 }
    );
  }

  try {
    // Make the API call to trigger the admin revision endpoint
    // adminFeedback
    const res = await fetch(
      `${process.env.BASE_URL}/api/admin/crafter-revision`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          crafterId,
          role,
          adminFeedback,
        }),
      }
    );

    const responseData = await res.json();

    // Prepare the email data
    const { html, subject, to } = adminRevisionRequested(
      crafterName,
      crafterEmail,
      role,
      taskName
    );

    // Send the email and block further execution if it fails
    try {
      await sendMail(subject, html, to);
    } catch (emailError) {
      // If email sending fails, throw an error to stop further execution
      throw new Error(
        `Failed to send revision request email: ${emailError.message}`
      );
    }

    // Return the response data to the client
    return JSON.parse(JSON.stringify(responseData)); // Ensure it is a plain object
  } catch (error) {
    // Catch any errors during the process and return a plain object with the error
    console.error(error); // You can also log the error for debugging
    return { error: error.message }; // Return the error message to the client
  }
}
