import nodemailer from "nodemailer";

const sendEmail = async function (options) {
  try {
    //? Create transporter

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
    });

    //? Send email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: options.email,
      subject: options.subject,
      text: options.description,
    });
  } catch (err) {
    throw err;
  }
};

export default sendEmail;
