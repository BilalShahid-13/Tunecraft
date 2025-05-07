export const paymentSuccessfull = {
  subject: "Payment Successful",
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
   `,
};

export const forgotPassword = (otp) => {
  return {
    subject: "Your Password Reset Code",
    html: `<p>Your password reset code is
    <strong>${otp}</strong>.
    It expires in 1 hour.</p>`,
  };
};
