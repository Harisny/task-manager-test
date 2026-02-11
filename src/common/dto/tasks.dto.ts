import { TaskStatus } from '../enums/task-status.enum';

export class CreateTaskRequest {
  title: string;
  description?: string;
}

export class UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export class TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  userId: string;
  createdAt: Date;
}

export class TasksResponse {
  tasks: TaskResponse[];
  total: number;
}
