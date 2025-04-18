const nodemailer = require("nodemailer");
const { totp } = require("otplib");
const taransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mrasad.apex@gmail.com",
    pass: "nipk nihn ugar eoib",
  },
});

totp.options = {
  step: 360,
  digits: 5,
};

async function sendEmail(email, name, otp) {
  await taransporter.sendMail({
    to: email,
    subject: "Your Password",
    from: "APEX",
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; text-align: center;">
          <div style="max-width: 500px; background: white; padding: 20px; margin: auto; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333;">Salom! ${name}</h2>
            <p style="font-size: 16px; color: #555;">Bu sizning maxfiy parolingiz, uni hech kimga bermang!</p>
            <div style="background: #007BFF; color: white; padding: 15px; font-size: 24px; font-weight: bold; border-radius: 5px; display: inline-block; margin: 10px 0;">
              ${otp}
            </div>
            <p style="font-size: 14px; color: #777;">Agar bu siz emas bo‘lsa, iltimos, xavfsizlik sababli parolingizni o‘zgartiring.</p>
          </div>
        </div>
      `,
  });
  console.log("Email jo‘natildi");
}

module.exports = sendEmail;
