import * as nodemailer from 'nodemailer';

import { Promise } from 'bluebird';

import { Config } from '../shared/config';

export class EmailService {

  public constructor(private config : Config) {}

  public send(filepath : string) : Promise<void|string> {
    const transporter = nodemailer.createTransport({
      service: this.config.get('emailService'),
      auth: {
        user: this.config.get('emailFrom'),
        pass: this.config.get('emailPassword')
      }
    });

    const message = {
      from: this.config.get('emailFrom'),
      to: this.config.get('emailTo'),
      subject: `ebook ${filepath.slice(filepath.lastIndexOf('/')+1)} is now available`,
      text: "Don't forget to sync your kindle",
      html: "<b>Don't forget to sync your kindle</b>",
      attachments: [{ path : filepath }]
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(message, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(`Message ${info.messageId} sent: ${info.response}`);
        }
      });
    });
  }
}
