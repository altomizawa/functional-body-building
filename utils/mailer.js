import nodemailer from "nodemailer";

export async function sendResetEmail(email, resetLink, type, code) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    },
  });
  try {
    switch (type) {
      case 'reset':
      await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 15 minutes.</p>`,
    });
    break;
    case '2fa':
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "2FA Code",
        html: `<p>Your 2FA code is: <strong>${code}</strong>. This code is valid for 5 minutes.</p>`,
      });
      break;
      default:
        throw new Error("Invalid email type");
    }
  } catch (error) {
    throw new Error(`failed to send email: ${error.message}`);
  }
}

