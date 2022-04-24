import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NAMESPACES } from '@/core/config';
import { GraphQLModule } from '@nestjs/graphql';
import { HelpModule } from '@/core/help/help.module';
import { pathTo } from '@/common/utils/files';
import { DatabaseModule } from '@/core/database/database.module';
import { UserModule } from '@/user/user.module';
import { ManagerModule } from '@/core/manager/manager.module';
import { GraphQLError } from 'graphql';
import { AuthModule } from '@/core/auth/auth.module';
import { RedisModule } from '@/core/redis/redis.module';
import { MailModule } from '@/common/services/mail/mail.module';

@Module({
    imports: [
        ManagerModule,
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            expandVariables: true,
            load: NAMESPACES
        }),
        GraphQLModule.forRoot({
            debug: true,
            playground: true,
            autoSchemaFile: pathTo('schema.gql'),
            sortSchema: true,
            context: ({ req, res }) => ({ req, res }),
            formatError: (error: GraphQLError) =>
                error.extensions?.exception?.response?.message || error.message
        }),
        RedisModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => config.get('redis.url')
        }),
        DatabaseModule,
        HelpModule,
        MailModule,
        AuthModule,
        UserModule
    ]
})
export class AppModule {}
