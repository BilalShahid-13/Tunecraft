import { paymentSuccessfull } from "@/lib/emailTemplates";
import { sendMail } from "@/utils/emailService";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { to } = await request.json();
    const info = await sendMail(
      paymentSuccessfull.subject,
      paymentSuccessfull.html,
      to
    );

    return new Response(
      JSON.stringify({
        message: "Email sent!",
        previewURL: nodemailer.getTestMessageUrl(info),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Failed to send email", error: error.message }),
      { status: 500 }
    );
  }
}
