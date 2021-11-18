import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export async function sendEmail(
  email: string,
  url: string,
  subject = 'Test mail',
) {
  Logger.log(`Send email to ${email} and url ${url}`);

  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Test email" <foo@example.com>',
    to: email,
    subject: subject,
    text: url,
  });

  Logger.log(`Message sent: ${info.messageId}`);
  Logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}
