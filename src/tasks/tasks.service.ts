import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ValidationService } from 'src/common/validation/validation.service';
import {
  CreateTaskRequest,
  TaskResponse,
  TasksResponse,
  UpdateTaskRequest,
} from 'src/common/dto/tasks.dto';
import { TaskValidation } from './tasks.validation';
import type { AuthUser } from 'src/common/dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from 'src/common/entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    private readonly validationService: ValidationService,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(user: AuthUser, req: CreateTaskRequest): Promise<TaskResponse> {
    const createRequest = this.validationService.validate<CreateTaskRequest>(
      TaskValidation.CREATE,
      req,
    );

    const task = this.taskRepository.create({
      title: createRequest.title,
      description: createRequest.description ?? null,
      userId: user.id,
    });

    const saved = await this.taskRepository.save(task);

    const { description, ...rest } = saved;

    return {
      ...rest,
      description: description ?? undefined,
    };
  }

  async list(user: AuthUser): Promise<TasksResponse> {
    const [tasks, total] = await this.taskRepository.findAndCount({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });

    return {
      tasks: tasks.map((task) => {
        const { description, ...rest } = task;

        return {
          ...rest,
          description: description ?? undefined,
        };
      }),
      total,
    };
  }

  async get(user: AuthUser, id: string): Promise<TaskResponse> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!task) {
      throw new HttpException('task tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const { description, ...rest } = task;

    return {
      ...rest,
      description: description ?? undefined,
    };
  }

  async update(
    user: AuthUser,
    id: string,
    req: UpdateTaskRequest,
  ): Promise<TaskResponse> {
    const updateRequest = this.validationService.validate<UpdateTaskRequest>(
      TaskValidation.UPDATE,
      req,
    );

    const existing = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!existing) {
      throw new HttpException('task tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const task = await this.taskRepository.save({
      ...existing,
      title: updateRequest.title ?? existing.title,
      description:
        updateRequest.description === undefined
          ? existing.description
          : (updateRequest.description ?? null),
      status: updateRequest.status ?? existing.status,
    });

    const { description, ...rest } = task;

    return {
      ...rest,
      description: description ?? undefined,
    };
  }

  async remove(user: AuthUser, id: string): Promise<void> {
    const existing = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!existing) {
      throw new HttpException('task tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    await this.taskRepository.delete({ id: existing.id });
  }
}
