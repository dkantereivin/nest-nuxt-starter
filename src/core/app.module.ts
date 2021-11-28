import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NAMESPACES } from '@/core/config';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from '@/user/user.module';
import { join } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            expandVariables: true,
            load: NAMESPACES
        }),
        UserModule,
        GraphQLModule.forRoot({
            debug: true,
            playground: true,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true
        })
    ]
})
export class AppModule {
}
