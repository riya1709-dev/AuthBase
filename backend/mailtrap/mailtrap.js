// mailtrap/mailtrap.js
require('dotenv').config(); // Load environment variables
const { MailtrapClient } = require("mailtrap");

// Initialize Mailtrap client with environment variables
const client = new MailtrapClient({
  endpoint: process.env.MAIL_TRAP_ENDPOINT,
  token: process.env.MAILTRAP_TOKEN
});

// Define the sender as an object with "email" and "name" keys
const sender = {
  email: "hello@demomailtrap.com",  // The sender's email
  name: "Riya Test"  // The sender's name
};

module.exports = {
  sender,
  client
};
