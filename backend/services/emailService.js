import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

if (!BREVO_API_KEY) {
  throw new Error("Missing Brevo API key in environment variables.");
}

const sendEmail = async (payload) => {
  try {
    await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });
    console.log(`✅ Email sent successfully to: ${payload.to[0].email}`);
    return true;
  } catch (error) {
    console.error(
      "❌ Failed to send email:",
      error.response?.data || error.message
    );
    // Re-throw the error to be handled by the calling function
    throw new Error("Failed to send the email via email service.");
  }
};

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

export const sendPasswordResetEmail = async (email, resetCode, firstName) => {
  const payload = {
    sender: { name: "Candelaria Eye Care Clinic", email: SENDER_EMAIL },
    to: [{ email }],
    subject: "Password Reset Request - Candelaria Eye Care Clinic",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8b0000;">Password Reset Request</h2>
        <p>Hello ${firstName},</p>
        <p>We received a request to reset your password. Use the code below to complete the process:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
          <h1 style="color: #8b0000; letter-spacing: 5px; font-size: 32px;">${resetCode}</h1>
        </div>
        <p>This code is valid for 10 minutes.</p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
      </div>
    `,
  };
  return sendEmail(payload);
};

export const sendAppointmentConfirmationEmail = async ({
  email,
  firstName,
  appointmentDate,
  appointmentTime,
  serviceType,
}) => {
  const formattedDate = new Date(appointmentDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const payload = {
    sender: { name: "Candelaria Eye Care Clinic", email: SENDER_EMAIL },
    to: [{ email }],
    subject: "Your Appointment has been Scheduled - Candelaria Eye Care Clinic",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #8b0000; color: white; padding: 20px;">
          <h2 style="margin: 0;">Appointment Confirmation</h2>
        </div>
        <div style="padding: 20px;">
          <p>Hello ${firstName},</p>
          <p>Your appointment has been successfully scheduled. Here are the details:</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Service:</strong> ${serviceType}</p>
            <p style="margin: 10px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 10px 0;"><strong>Time:</strong> ${appointmentTime}</p>
          </div>
          <p>We look forward to seeing you at the Candelaria Eye Care Clinic. If you need to reschedule, please contact us at your earliest convenience.</p>
          <p>Thank you!</p>
        </div>
      </div>
    `,
  };
  // Use the generic sendEmail function to dispatch the email
  return sendEmail(payload);
};

export const sendAccountCreationEmail = async ({
  email,
  firstName,
  temporaryPassword,
}) => {
  const payload = {
    sender: { name: "Candelaria Eye Care Clinic", email: SENDER_EMAIL },
    to: [{ email }],
    subject: "Your CECC Patient Portal Account Has Been Created!",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #8b0000; color: white; padding: 20px;">
          <h2 style="margin: 0;">Welcome to Your Patient Portal</h2>
        </div>
        <div style="padding: 20px;">
          <p>Hello ${firstName},</p>
          <p>An account has been created for you at the Candelaria Eye Care Clinic patient portal. You can use these credentials to log in and manage your appointments and records.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Email / Username:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Temporary Password:</strong></p>
            <h3 style="color: #333; text-align: center;">${temporaryPassword}</h3>
          </div>
          <p>We highly recommend that you log in and change your password from your account settings at your earliest convenience.</p>
          <p>Thank you!</p>
        </div>
      </div>
    `,
  };
  return sendEmail(payload);
};
