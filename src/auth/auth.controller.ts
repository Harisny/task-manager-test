import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from 'src/common/dto/auth.dto';
import type { AuthUser } from 'src/common/dto/auth.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() req: RegisterRequest): Promise<ApiResponse<void>> {
    await this.authService.register(req);

    return {
      success: true,
      message: 'registrasi berhasil',
    };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() req: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const data = await this.authService.login(req);

    return {
      success: true,
      message: 'login berhasil',
      data,
    };
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  me(@GetUser() user: AuthUser): ApiResponse<AuthUser> {
    return {
      success: true,
      message: 'token valid',
      data: user,
    };
  }
}
