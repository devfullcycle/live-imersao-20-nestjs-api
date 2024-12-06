import { Module } from '@nestjs/common';
import { ConfigModule } from '../config';
import { MailService } from './mail.service';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [ConfigModule, MailerModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
