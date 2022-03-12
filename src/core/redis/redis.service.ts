import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { REDIS_CONFIG_PROVIDER } from './redis.constants';

@Injectable()
export class RedisService extends Redis {
    constructor(@Inject(REDIS_CONFIG_PROVIDER) options: RedisOptions) {
        super(options);
        const logger = new Logger(RedisService.name);
        this.on('ready', () => {
            logger.log('Established connection to redis.');
        });
    }
}
