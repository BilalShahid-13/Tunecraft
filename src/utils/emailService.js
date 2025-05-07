import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.GOOGLE_APP_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});
export async function sendMail(subject, html,to) {
  try {
    const info = await transporter.sendMail({
      to: user.email || to,
      from: process.env.GOOGLE_APP_USER,
      subject: subject,
      html: html,
    });
    return info;
  } catch (error) {
    console.error("eror from emailService", error);
  }
}
