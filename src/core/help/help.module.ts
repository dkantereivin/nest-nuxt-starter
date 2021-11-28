import { Module } from '@nestjs/common';
import { HelpResolver } from './help.resolver';

@Module({
    providers: [HelpResolver]
})
export class HelpModule {}
