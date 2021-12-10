import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NAMESPACES } from '@/core/config';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from '@/user/user.module';
import { HelpModule } from '@/core/help/help.module';
import { pathTo } from '@/common/utils/files';

@Module({
    imports: [
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
            sortSchema: true
        }),
        HelpModule,
        UserModule
    ]
})
export class AppModule {}
