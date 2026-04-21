import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProd = configService.get<string>('nodeEnv') === 'production';
  const url = configService.get<string>('database.url');
  if (!url) {
    throw new Error('DATABASE_URL is required');
  }

  const ssl = isProd
    ? {
        rejectUnauthorized: false,
      }
    : false;

  return {
    type: 'postgres',
    url,
    autoLoadEntities: true,
    synchronize: !isProd,
    logging: isProd ? ['error'] : ['error', 'warn'],
    ssl,
  };
};
