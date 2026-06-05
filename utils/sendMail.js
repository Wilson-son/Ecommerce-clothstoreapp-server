import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();    

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

await transporter.sendMail({
  to: user.email,
  subject: "Password Reset",
  html: `
    <a href="${resetUrl}">
      Reset Password
    </a>
  `,
});