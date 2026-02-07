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
  Req,
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
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { TasksService } from './tasks.service';
import type { Request } from 'express';

type AuthenticatedRequest = Request & { user?: AuthUser };

@Controller('/api/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateTaskRequest,
  ): Promise<ApiResponse<TaskResponse>> {
    const user = req.user as AuthUser;
    const data = await this.tasksService.create(user, body);

    return {
      success: true,
      message: 'task berhasil dibuat',
      data,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Req() req: AuthenticatedRequest,
  ): Promise<ApiResponse<TasksResponse>> {
    const user = req.user as AuthUser;
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
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<ApiResponse<TaskResponse>> {
    const user = req.user as AuthUser;
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
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateTaskRequest,
  ): Promise<ApiResponse<TaskResponse>> {
    const user = req.user as AuthUser;
    const data = await this.tasksService.update(user, id, body);

    return {
      success: true,
      message: 'task berhasil diperbarui',
      data,
    };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<ApiResponse<void>> {
    const user = req.user as AuthUser;
    await this.tasksService.remove(user, id);

    return {
      success: true,
      message: 'task berhasil dihapus',
    };
  }
}
