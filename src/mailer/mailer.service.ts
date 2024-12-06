import { Injectable } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import * as nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { ConfigService } from '../config';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('MAIL_HOST'),
      port: configService.get('MAIL_PORT'),
      ignoreTLS: configService.get('MAIL_IGNORE_TLS') === 'true',
      secure: configService.get('MAIL_SECURE') === 'true',
      requireTLS: configService.get('MAIL_REQUIRE_TLS') === 'true',
      auth: {
        user: configService.get('MAIL_USER'),
        pass: configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      const template = await readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${this.configService.get('MAIL_DEFAULT_NAME')}" <${this.configService.get('MAIL_DEFAULT_EMAIL')}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }
}
