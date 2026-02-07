import { Injectable } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ValidationService {
  validate<T>(schema: z.ZodType<T>, data: unknown): T {
    return schema.parse(data);
  }
}
