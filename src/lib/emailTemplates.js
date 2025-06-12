const supportEmail = "support@example.com";

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

export const userApproved = (username, email, password) => {
  return {
    to: email,
    // to: "bcsm-f21-249@superior.edu.pk",
    subject: "🎉 Your Account Has Been Approved!",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px;
    margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
     <h2 style="color: #ff7e6e;">Welcome to Tunecraft!</h2>
     <p>Hello <strong>${username}</strong>,
     </p> <p>Your account has been approved.
     You can now log in using the credentials below:</p>
     <table style="margin-top: 20px;"> <tr><td>
     <strong>Email:</strong></td><td>${email}
     </td></tr> <tr><td><strong>Password:</strong>
     </td><td><code>${password}</code></td></tr>
     </table> <p style="margin-top: 20px;">
     Click below to get started:</p>
     <a href=${process.env.BASE_URL}/Register
      target="_blank" rel="noopener noreferrer"
     style="display:inline-block; padding: 10px 15px;
      background-color: #ff7e6e; color: white; text-decoration: none;
       border-radius: 4px;">Login Now</a> <p style="margin-top: 30px;
       font-size: 0.9em; color: #888;">If you didn't request
        this account or believe this is a mistake,
        please contact our support team.</p> ${supportEmail}<p>–
        The Tunecraft Team</p> </div>`,
  };
};

export const crafterApproved = (username, email, role) => {
  return {
    to: email,
    subject: "🎉 Your Crafter Account Has Been Approved!",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #4CAF50;">Welcome to Tunecraft, ${username}!</h2>
        <p>We are excited to inform you that your crafter account has been approved.</p>
        <p>As a <strong>${role}</strong> on Tunecraft, you're now able to start accepting tasks and collaborating on projects!</p>
        <p>Here are your account details:</p>
        <table style="margin-top: 20px; width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; font-weight: bold;">Email:</td>
            <td style="padding: 10px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Role:</td>
            <td style="padding: 10px;">${role}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">
          Ready to get started? <br/>
          Click the button below to log in and explore your dashboard:
        </p>
        <a href="${process.env.BASE_URL}/login" target="_blank" rel="noopener noreferrer"
          style="display: inline-block; padding: 12px 18px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
          Login Now
        </a>
        <p style="margin-top: 30px; font-size: 0.9em; color: #888;">
          If you did not request this account or believe this is a mistake, please contact our support team.
        </p>
        <p style="color: #888; font-size: 0.9em;">– The Tunecraft Team</p>
    </div>`,
  };
};

export const adminRevisionRequested = (username, email, role, taskName) => {
  return {
    to: email, // Crafter's email
    subject: "🔄 Revision Requested for Your Crafter Task",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #FF5722;">Hi ${username},</h2>
        <p>We hope you're doing well! The admin has reviewed the task <strong>${taskName}</strong> that you submitted on Tunecraft and has requested a revision.</p>
        <p>Please review the feedback provided and make the necessary changes. Once you've made the required adjustments, please resubmit the task for final approval.</p>
        <p>Here are the details of your task:</p>
        <table style="margin-top: 20px; width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; font-weight: bold;">Email:</td>
            <td style="padding: 10px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Role:</td>
            <td style="padding: 10px;">${role}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Task Name:</td>
            <td style="padding: 10px;">${taskName}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">
          Please log in to your dashboard to review the feedback and make the necessary revisions:
        </p>
        <a href="${process.env.BASE_URL}/Register" target="_blank" rel="noopener noreferrer"
          style="display: inline-block; padding: 12px 18px; background-color: #FF5722; color: white; text-decoration: none; border-radius: 5px;">
          Revise Your Task
        </a>
        <p style="margin-top: 30px; font-size: 0.9em; color: #888;">
          If you have any questions or need assistance, feel free to contact our support team.
        </p>
        <p style="color: #888; font-size: 0.9em;">– The Tunecraft Team</p>
    </div>`,
  };
};
