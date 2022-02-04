import { databaseConfig } from './database.config';
import { appConfig } from './app.config';
import { authConfig } from '@/core/config/auth.config';

const NAMESPACES = [appConfig, databaseConfig, authConfig];

export { NAMESPACES, appConfig, databaseConfig, authConfig };
