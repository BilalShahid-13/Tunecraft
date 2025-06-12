"use server";

import { crafterApproved } from "@/lib/emailTemplates";
import { sendMail } from "@/utils/emailService";

export default async function crafterApproveAction(
  _id,
  role,
  payment,
  currentRole,
  crafterUsername,
  crafterEmail
) {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/admin/crafter-approve`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: _id,
          role,
          paymentId: payment,
          prevRole: currentRole,
        }),
      }
    );

    if (res.status === 200) {
      const { html, subject, to } = crafterApproved(
        crafterUsername,
        crafterEmail,
        role
      );
      const mailResult = await sendMail(subject, html, to);

      // Check if mailResult has an error or unexpected result
      if (!mailResult || mailResult.error) {
        throw new Error("Failed to send approval email.");
      }
    } else {
      throw new Error(`Failed to approve crafter. Status code: ${res.status}`);
    }

    // Return a simple response, not the full complex object
    return { status: res.status, message: "Crafter approved" };
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in crafterApproveAction:", error);

    // Throw the error to stop execution and propagate the issue
    throw error;
  }
}
