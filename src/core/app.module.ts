import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NAMESPACES } from '@/core/config';
import { GraphQLModule } from '@nestjs/graphql';
import { HelpModule } from '@/core/help/help.module';
import { pathTo } from '@/common/utils/files';
import { DatabaseModule } from '@/core/database/database.module';
import { UserModule } from '@/user/user.module';
import { ManagerModule } from '@/core/manager/manager.module';
import { GraphQLError } from 'graphql';

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
            formatError: (error: GraphQLError) =>
                error.extensions?.exception?.response?.message || error.message
        }),
        DatabaseModule,
        HelpModule,
        UserModule
    ]
})
export class AppModule {}
