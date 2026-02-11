import 'dotenv/config';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Task],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
};

export const AppDataSource = new DataSource(typeOrmConfig);
