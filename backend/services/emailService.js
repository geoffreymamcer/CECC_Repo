import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// Validate environment variables
if (!EMAIL_USER || !EMAIL_PASSWORD) {
  console.error("Missing required environment variables:");
  console.error("EMAIL_USER:", !!EMAIL_USER);
  console.error("EMAIL_PASSWORD:", !!EMAIL_PASSWORD);
  throw new Error("Email configuration is incomplete. Check your .env file.");
}

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

// Log configuration (safely)
console.log("Email configuration loaded for:", EMAIL_USER);

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.log("Transporter verification error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export const sendVerificationEmail = async (
  email,
  verificationCode,
  firstName
) => {
  try {
    if (!email) {
      console.error("Email is required but was not provided");
      throw new Error("Email is required");
    }

    if (!verificationCode) {
      console.error("Verification code is required but was not provided");
      throw new Error("Verification code is required");
    }

    if (!firstName) {
      console.error("First name is required but was not provided");
      throw new Error("First name is required");
    }

    console.log("Sending verification email to:", email);

    const mailOptions = {
      from: `CECC Eye Care <${EMAIL_USER}>`,
      to: email,
      subject: "Email Verification - CECC Eye Care",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b0000;">Welcome to CECC Eye Care!</h2>
          <p>Hello ${firstName},</p>
          <p>Thank you for registering with CECC Eye Care. To complete your registration, please enter the verification code below:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
            <h1 style="color: #8b0000; letter-spacing: 5px; font-size: 32px;">${verificationCode}</h1>
          </div>
          <p>This code will expire in 1 hour.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <p style="margin-top: 30px;">Best regards,<br>CECC Eye Care Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};
