import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/core/app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const config = app.get(ConfigService);
    const logger = new Logger('Global');

    const port = config.get<number>('app.port');
    const listen = config.get<string>('app.listen');
    await app.listen(port, listen, () => {
        logger.log(`Application is running on: ${listen}:${port}`);
    });
}

bootstrap();
