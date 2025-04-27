import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { to, subject } = await request.json();
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.GOOGLE_APP_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    // Send mail
    const info = await transporter.sendMail({
      from: process.env.GOOGLE_APP_USER, // sender address
      to: to || "someone@example.com", // receiver address
      subject: subject || "Hello World!", // subject line
      html: `
     <h1 style="color: #d27461; font-size: 60px;">TUNECRAFT</h1>
       <h1>Payment Successful! 🎉</h1>
    <p><strong>Thank you for your order!</strong></p>
    <p>Our talented artists and lyricists have started working on your special song.</p>

    <h2>📝 What's Next:</h2>
    <p>We’ll craft personalized lyrics and music based on your story.</p>

    <p>Our team will send you updates as we progress.</p>

    <h3>📅 Estimated Delivery:</h3>
    <p><strong>3-5 working days</strong> (or whatever your timing is)</p>

    <p>
      If you have any additional ideas or changes, feel free to contact us at
      <a href="mailto:support@example.com">support@example.com</a> or
      <a href="https://wa.me/yourwhatsapplink">WhatsApp</a>.
    </p>

    <p><strong>Thank you for trusting us to create something unforgettable! ❤️</strong></p>
      `, // plain text body
    });


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
