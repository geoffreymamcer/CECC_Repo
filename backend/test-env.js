import dotenv from "dotenv";
dotenv.config();

console.log("Environment Variables Test:");
console.log("EMAIL_USER defined:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD defined:", !!process.env.EMAIL_PASSWORD);
console.log("EMAIL_USER length:", process.env.EMAIL_USER?.length || 0);
console.log("EMAIL_PASSWORD length:", process.env.EMAIL_PASSWORD?.length || 0);
