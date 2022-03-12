import { databaseConfig } from './database.config';
import { appConfig } from './app.config';
import { authConfig } from './auth.config';
import { redisConfig } from './redis.config';

const NAMESPACES = [appConfig, databaseConfig, redisConfig, authConfig];

export { NAMESPACES, appConfig, databaseConfig, redisConfig, authConfig };
