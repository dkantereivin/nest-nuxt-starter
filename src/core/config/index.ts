import { databaseConfig } from './database.config';
import { appConfig } from './app.config';
import { authConfig } from './auth.config';
import { redisConfig } from './redis.config';
import { mailConfig } from './mail.config';

const NAMESPACES = [appConfig, databaseConfig, redisConfig, authConfig, mailConfig];

export { NAMESPACES, appConfig, databaseConfig, redisConfig, authConfig, mailConfig };
