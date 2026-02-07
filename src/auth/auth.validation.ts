import z, { ZodType } from 'zod';
import type { LoginRequest, RegisterRequest } from 'src/common/dto/auth.dto';

export class AuthValidation {
  static readonly REGISTER: ZodType<RegisterRequest> = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    password: z.string().min(5).max(100),
  });

  static readonly LOGIN: ZodType<LoginRequest> = z.object({
    email: z.string().email(),
    password: z.string().min(5).max(100),
  });
}
