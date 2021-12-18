import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/core/app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { LifecycleService } from '@/core/manager/lifecycle.service';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const config = app.get(ConfigService);
    const lifecycle = app.get(LifecycleService);
    const logger = new Logger('Global');

    lifecycle.subscribeToShutdown(async () => {
        await app.close();
        lifecycle.logger.warn('Application stopped gracefully.');
        process.exit();
    });

    const port = config.get<number>('app.port');
    const listen = config.get<string>('app.listen');
    await app.listen(port, listen, () => {
        logger.log(`Application is running on: ${listen}:${port}`);
    });
}

bootstrap();
