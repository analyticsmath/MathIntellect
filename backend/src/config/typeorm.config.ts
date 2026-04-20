import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isDev = configService.get<string>('nodeEnv') !== 'production';
  const url = configService.get<string>('database.url');

  return {
    type: 'postgres',
    url,
    autoLoadEntities: true,
    synchronize: isDev,
    logging: isDev ? ['error', 'warn'] : false,
    ssl: false,
  };
};
