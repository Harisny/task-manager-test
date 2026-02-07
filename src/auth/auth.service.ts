import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { AuthValidation } from 'src/auth/auth.validation';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from 'src/common/dto/auth.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationService } from 'src/common/validation/validation.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly validationService: ValidationService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(req: RegisterRequest): Promise<void> {
    const registerRequest = this.validationService.validate<RegisterRequest>(
      AuthValidation.REGISTER,
      req,
    );

    const emailCount = await this.prismaService.user.count({
      where: {
        email: registerRequest.email,
      },
    });

    if (emailCount > 0) {
      throw new BadRequestException('email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(registerRequest.password, 10);

    await this.prismaService.user.create({
      data: {
        name: registerRequest.name,
        email: registerRequest.email,
        password: hashedPassword,
      },
    });
  }

  async login(req: LoginRequest): Promise<LoginResponse> {
    const loginRequest = this.validationService.validate<LoginRequest>(
      AuthValidation.LOGIN,
      req,
    );

    const user = await this.prismaService.user.findUnique({
      where: { email: loginRequest.email },
    });

    if (!user) {
      this.throwInvalidCredentials();
    }

    const passwordMatch = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!passwordMatch) {
      this.throwInvalidCredentials();
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  private throwInvalidCredentials(): never {
    throw new UnauthorizedException('email atau password salah');
  }
}
