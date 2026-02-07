import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationService } from 'src/common/validation/validation.service';
import {
  CreateTaskRequest,
  TaskResponse,
  TasksResponse,
  UpdateTaskRequest,
} from 'src/common/dto/tasks.dto';
import { TaskValidation } from './tasks.validation';
import type { AuthUser } from 'src/common/dto/auth.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  async create(user: AuthUser, req: CreateTaskRequest): Promise<TaskResponse> {
    const createRequest = this.validationService.validate<CreateTaskRequest>(
      TaskValidation.CREATE,
      req,
    );

    const task = await this.prismaService.task.create({
      data: {
        title: createRequest.title,
        description: createRequest.description,
        userId: user.id,
      },
    });

    const { description, ...rest } = task;

    return {
      ...rest,
      description: description ?? undefined,
    };
  }

  async list(user: AuthUser): Promise<TasksResponse> {
    const [tasks, total] = await Promise.all([
      this.prismaService.task.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.task.count({
        where: { userId: user.id },
      }),
    ]);

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
    const task = await this.prismaService.task.findFirst({
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

    const existing = await this.prismaService.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      throw new HttpException('task tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const task = await this.prismaService.task.update({
      where: { id: existing.id },
      data: {
        title: updateRequest.title,
        description: updateRequest.description,
        status: updateRequest.status,
      },
    });

    const { description, ...rest } = task;

    return {
      ...rest,
      description: description ?? undefined,
    };
  }

  async remove(user: AuthUser, id: string): Promise<void> {
    const existing = await this.prismaService.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      throw new HttpException('task tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.task.delete({
      where: { id: existing.id },
    });
  }
}
