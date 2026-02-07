import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import {
  CreateTaskRequest,
  TaskResponse,
  TasksResponse,
  UpdateTaskRequest,
} from 'src/common/dto/tasks.dto';
import type { AuthUser } from 'src/common/dto/auth.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';

@Controller('/api/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() user: AuthUser,
    @Body() req: CreateTaskRequest,
  ): Promise<ApiResponse<TaskResponse>> {
    const data = await this.tasksService.create(user, req);

    return {
      success: true,
      message: 'task berhasil dibuat',
      data,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@GetUser() user: AuthUser): Promise<ApiResponse<TasksResponse>> {
    const data = await this.tasksService.list(user);

    return {
      success: true,
      message: 'daftar task berhasil diambil',
      data,
    };
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async get(
    @GetUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<ApiResponse<TaskResponse>> {
    const data = await this.tasksService.get(user, id);

    return {
      success: true,
      message: 'task berhasil diambil',
      data,
    };
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @GetUser() user: AuthUser,
    @Param('id') id: string,
    @Body() req: UpdateTaskRequest,
  ): Promise<ApiResponse<TaskResponse>> {
    const data = await this.tasksService.update(user, id, req);

    return {
      success: true,
      message: 'task berhasil diperbarui',
      data,
    };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @GetUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<void> {
    await this.tasksService.remove(user, id);
  }
}
