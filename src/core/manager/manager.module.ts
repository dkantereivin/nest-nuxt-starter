import { Global, Module } from '@nestjs/common';
import { LifecycleService } from './lifecycle.service';

@Global()
@Module({
    providers: [LifecycleService],
    exports: [LifecycleService]
})
export class ManagerModule {}
