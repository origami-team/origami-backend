const nodemailer = require("nodemailer");

module.exports.verifyUserRegistration = async (user) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_SMTP_USERNAME,
      pass: process.env.MAIL_SMTP_PASSWORD,
    },
  });

  let link = "";
  if (process.env.NODE_ENV === "production") {
    link = `${process.env.API_URL}/user/confirm-email?token=${user.emailConfirmationToken}`;
  } else {
    link = `${process.env.API_URL}:${process.env.API_PORT}/user/confirm-email?token=${user.emailConfirmationToken}`;
  }

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"OriGami 👻" <${process.env.MAIL_SENDER_ADDRESS}>`,
    to: user.email,
    subject: "Deine Registrierung bei OriGami", // Subject line
    html: `<b>Hallo ${user.username} 👋</b><br /><p>Bitte klicke auf den folgenden Link um deine E-Mail Adresse zu bestätigen <br /><br /><a href="${link}">${link}</a><br /><br /><p>Liebe Grüße<br>Dein OriGami-Team</p>`,
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports.resetPassword = async (user) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_SMTP_USERNAME,
      pass: process.env.MAIL_SMTP_PASSWORD,
    },
  });

  let link = "";
  if (process.env.NODE_ENV === "production") {
    link = `${process.env.APP_URL}/user/reset-password?token=${user.resetPasswordToken}`;
  } else {
    link = `${process.env.APP_URL}:${process.env.APP_PORT}/user/reset-password?token=${user.resetPasswordToken}`;
  }

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"OriGami 👻" <${process.env.MAIL_SENDER_ADDRESS}>`,
    to: user.email,
    subject: "Zurücksetzen deines OriGami Passworts", // Subject line
    html: `<b>Hallo ${user.username} 👋</b><br /><p>Bitte klicke auf den folgenden Link um dein Passwort zurückzusetzen. Der Link ist nur 12 Stunden gültig <br /><br /><a href="${link}">${link}</a><br /><br /><p>Liebe Grüße<br>Dein OriGami-Team</p>`,
  });

  console.log("Message sent: %s", info.messageId);
};
