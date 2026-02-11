import z, { ZodType } from 'zod';
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
} from 'src/common/dto/tasks.dto';
import { TaskStatus } from 'src/common/enums/task-status.enum';

export class TaskValidation {
  static readonly CREATE: ZodType<CreateTaskRequest> = z.object({
    title: z.string().min(1).max(100),
    description: z.string().max(1000).optional(),
  });

  static readonly UPDATE: ZodType<UpdateTaskRequest> = z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().max(1000).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
  });
}
