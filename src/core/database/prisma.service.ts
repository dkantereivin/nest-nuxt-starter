import { PrismaClient } from '@prisma/client';
import { INestApplication, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { LifecycleService } from '@/core/manager/lifecycle.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(private lifecycle: LifecycleService) {
        super();
    }

    private logger = new Logger('PrismaService');

    async onModuleInit(): Promise<void> {
        await this.$connect()
            .then(() => this.logger.log('Established connection to the database.'))
            .catch((err) => {
                this.logger.error('Failed to establish connection to the database.');
                this.logger.debug(err);
                this.lifecycle.shutdown();
            });
    }
}
