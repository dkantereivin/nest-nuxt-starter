import {
    DynamicModule,
    InjectionToken,
    Module,
    ModuleMetadata,
    OptionalFactoryDependency
} from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisOptions } from 'ioredis';
import { REDIS_CONFIG_PROVIDER } from './redis.constants';

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    inject?: (InjectionToken | OptionalFactoryDependency)[];
    useFactory: (...args: any[]) => Promise<RedisOptions | string> | RedisOptions | string;
}

@Module({})
export class RedisModule {
    static forRoot(options: RedisOptions | string): DynamicModule {
        return {
            module: RedisModule,
            providers: [
                {
                    provide: REDIS_CONFIG_PROVIDER,
                    useValue: options
                },
                RedisService
            ],
            exports: [RedisService],
            global: true
        };
    }

    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
        return {
            module: RedisModule,
            providers: [
                {
                    provide: REDIS_CONFIG_PROVIDER,
                    useFactory: options.useFactory,
                    inject: options.inject ?? []
                },
                RedisService
            ],
            exports: [RedisService],
            global: true
        };
    }
}
