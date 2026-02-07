import { BadRequestException, Injectable } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ValidationService {
  validate<T>(schema: z.ZodType<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((issue) => {
          const path = issue.path.join('.') || 'input';
          return `${path}: ${issue.message}`;
        });

        throw new BadRequestException({
          message: 'Validasi gagal',
          errors,
        });
      }

      throw error;
    }
  }
}
