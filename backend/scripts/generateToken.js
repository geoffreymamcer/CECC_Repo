const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config();

const { OAuth2 } = google.auth;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI // or just hardcode this one if you're okay with it
);

// Generate the url that will be used for authorization
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://mail.google.com/"],
});

console.log("Authorize this app by visiting this url:", authUrl);
