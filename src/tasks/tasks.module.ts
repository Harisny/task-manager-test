import { ValidationService } from 'src/common/validation/validation.service';
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksService, ValidationService],
  controllers: [TasksController],
})
export class TasksModule {}
