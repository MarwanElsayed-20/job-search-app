import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  // sender details
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // email and receiver details
  const info = await transporter.sendMail({
    from: `"JOB SEARCH APP" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });

  // check if email is rejected
  if (info.rejected.length > 0) {
    return false;
  }
  return true;
};

export default sendEmail;
