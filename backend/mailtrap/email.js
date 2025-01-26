// sendVerificationEmail.js
const { client, sender } = require("../mailtrap/mailtrap");
const { VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE } = require("../mailtrap/emailTemplates");

const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  
  try {
    // Send email using the Mailtrap client
    const response = await client.send({
      from: sender,  // Use the sender object (contains "email" and "name")
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),  // Replace placeholder with token
      category: "Email verification"
    });

    console.log("Verification email sent", response);
  } catch (e) {
    console.error(`Error sending email: ${e.message}`);
    throw new Error(`error: ${e.message}`);
  }
};

const sendWelcomeEmail= async(email,name)=>{
    const recipient = [{ email }];
    try{
        const response = await client.send({
            from: sender,
            to: recipient,
            template_uuid:"3364ddec-0d3c-4909-b75b-40ef3c41de9b",
            template_variables: {
                "company_info_name": "Auth Company",
                "name": name
              }
    })
    console.log("Welcome email sent", response);
}catch(e){
    console.error(`Error sending email: ${e.message}`);
    throw new Error(`error: ${e.message}`);
}
}

const sendPasswordResetEmail=async(email,resetURL)=>{
  const recipient = [{ email }];
  try{
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category:"Password reset"
    })
    console.log("Verification email sent", response);
  }catch(e){
    console.error(`Error sending email: ${e.message}`);
    throw new Error(`error: ${e.message}`);
  }
}

const sendResetSuccessEmail=async (email) => {
  const recipient = [{ email }];
  try{
    const response = await client.send({
      from: sender,
      to: recipient,
      subject:"password reset successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category:"password reset"
    })
    console.log("Verification email sent", response);
  }catch(e){
    console.error(`Error sending email: ${e.message}`);
    throw new Error(`error: ${e.message}`);
  }
}
module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail
}
