import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: Number(configService.get<number>('DB_PORT', 5431)),
    username: configService.get<string>('DB_USERNAME', 'docker'),
    password: configService.get<string>('DB_PASSWORD', 'docker'),
    database: configService.get<string>('DB_DATABASE', 'users_db'),
    entities: [join(__dirname, '/../**/*.entity{.ts,js}')],
    synchronize: configService.get<string>('NODE_ENV') !== 'production',
    logging: configService.get<string>('NODE_ENV') === 'development',
});