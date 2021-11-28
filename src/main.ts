import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/core/app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const config = app.get(ConfigService);

    const port = config.get<number>('app.port');
    const listen = config.get<string>('app.listen');
    await app.listen(port, listen);
}

bootstrap();
