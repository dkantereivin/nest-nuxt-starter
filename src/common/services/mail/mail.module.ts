import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

// for outbound mail only (currently)
@Module({
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}
