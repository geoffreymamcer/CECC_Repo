import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

if (!BREVO_API_KEY) {
  throw new Error("Missing Brevo API key in environment variables.");
}

export const sendVerificationEmail = async (
  email,
  verificationCode,
  firstName
) => {
  try {
    console.log("Sending verification email via Brevo API to:", email);

    const payload = {
      sender: { name: "Candelaria Eye Care Clinic", email: SENDER_EMAIL },
      to: [{ email }],
      subject: "Email Verification - Candelaria Eye Care Clinic",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b0000;">Welcome to CECC Eye Care!</h2>
          <p>Hello ${firstName},</p>
          <p>Thank you for registering. Please use this code to verify your email:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
            <h1 style="color: #8b0000; letter-spacing: 5px; font-size: 32px;">${verificationCode}</h1>
          </div>
          <p>This code expires in 1 hour.</p>
          <p>If you didn't request this, please ignore it.</p>
        </div>
      `,
    };

    await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Verification email sent successfully to:", email);
    return true; // Ensure you return true on success
  } catch (error) {
    console.error(
      "❌ Failed to send email:",
      error.response?.data || error.message
    );
    throw new Error("Failed to send verification email");
  }
};

/*
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL =
  process.env.SENDER_EMAIL || "batocabemarkgeoffrey@gmail.com";

if (!BREVO_API_KEY) {
  throw new Error("Missing Brevo API key in environment variables.");
}

export const sendVerificationEmail = async (
  email,
  verificationCode,
  firstName
) => {
  try {
    console.log("Sending verification email via Brevo API to:", email);

    const payload = {
      sender: { name: "Candelaria Eye Care Clinic", email: SENDER_EMAIL },
      to: [{ email }],
      subject: "Email Verification - CECC Eye Care",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b0000;">Welcome to CECC Eye Care!</h2>
          <p>Hello ${firstName},</p>
          <p>Thank you for registering. Please use this code to verify your email:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
            <h1 style="color: #8b0000; letter-spacing: 5px; font-size: 32px;">${verificationCode}</h1>
          </div>
          <p>This code expires in 1 hour.</p>
          <p>If you didn't request this, please ignore it.</p>
        </div>
      `,
    };

    await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Verification email sent successfully to:", email);
  } catch (error) {
    console.error(
      "❌ Failed to send email:",
      error.response?.data || error.message
    );
    throw new Error("Failed to send verification email");
  }
};
*/
