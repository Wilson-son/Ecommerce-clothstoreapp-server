import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, 
  },
});

export const sendMail = async ({ email, subject, html }) => {
  await transporter.sendMail({
    from: `"Cara Store" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
  });
};

export default sendMail;