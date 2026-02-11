import { ValidationService } from 'src/common/validation/validation.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/common/entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksService, ValidationService],
  controllers: [TasksController],
  imports: [TypeOrmModule.forFeature([Task])],
})
export class TasksModule {}
