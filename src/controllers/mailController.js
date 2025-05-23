const nodemailer = require("nodemailer");

 let transporter;

  if (process.env.NODE_ENV === 'development') {
    transporter = {
      sendMail: async (mail) => {
        console.log('\n=== Mock Email Sent ===');
        console.log(`To: ${mail.to}`);
        console.log(`Subject: ${mail.subject}`);
        console.log(`Text: ${mail.text}`);
        console.log(`HTML:\n${mail.html}`);
        console.log('=======================\n');
        return Promise.resolve();
      }
    };
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.MAIL_SMTP_HOST,
      port: process.env.MAIL_SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_SMTP_USERNAME,
        pass: process.env.MAIL_SMTP_PASSWORD,
      },
    });
  }


module.exports.verifyUserRegistration = async (user) => {

  let link = "";
  // Note: user id was added to `verification link` to identify user when email is already verified.
  if (process.env.NODE_ENV === "production") {
    link = `${process.env.API_URL}/user/confirm-email?id=${user._id}&token=${user.emailConfirmationToken}`;
  } else {
    link = `${process.env.API_URL}:${process.env.API_PORT}/user/confirm-email?id=${user._id}&
    token=${user.emailConfirmationToken}`;
  }

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"GeoGami" <${process.env.MAIL_SENDER_ADDRESS}>`,
    to: user.email,
    subject: "Deine Registrierung bei GeoGami / Your registration at GeoGami", // Subject line
    html: `Hallo <b> ${user.username}, </b ><br />
    <p>Bitte klicke auf den folgenden Link um deine E-Mail Adresse zu bestätigen /  Please click on the link below to confirm your email address :<br /><br />
    <a href="${link}">${link}</a> <br /><br />
    <p>Liebe Grüße / Best wishes<br>GeoGami Team</p>`,
  });

  // console.log("Message sent: %s", info.messageId);
};

module.exports.resetPassword = async (user) => {

  let link = "";
  if (process.env.NODE_ENV === "production") {
    link = `${process.env.APP_URL}/user/reset-password?token=${user.resetPasswordToken}`;
  } else {
    link = `${process.env.APP_URL}:${process.env.APP_PORT}/user/reset-password?token=${user.resetPasswordToken}`;
  }

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"GeoGami" <${process.env.MAIL_SENDER_ADDRESS}>`,
    to: user.email,
    subject: "Zurücksetzen deines GeoGami Passworts / Your GeoGami Password Reset", // Subject line
    html: `Hallo <b> ${user.username},</b> <br/>
    <p> Wir haben eine Anfrage zum Zurücksetzen Ihres GeoGami-Passworts erhalten. Wenn Sie das waren, verwenden Sie bitte den Bestätigungscode unten, um das Zurücksetzen Ihres Passworts abzuschließen. </p>
    </p>Verification code: ${user.resetPasswordToken}</p><br />
    <p>Liebe Grüße <br> GeoGami Team</p>
    <br/><br/>
  
    <b>Englsih Version</b><br /><br />
    Hello <b> ${user.username}, </b><br />
    <p> We received a request to reset your GeoGami password. If this was you, please use the verification code below to finish resetting your password. </p>
    </p>Verification code: ${user.resetPasswordToken}</p><br/>
    <p>Best wishes <br> GeoGami Team</p>`,
  });

  // console.log("Message sent: %s", info.messageId);
};
