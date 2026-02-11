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
import { User } from 'src/common/entities/user.entity';
import { ValidationService } from 'src/common/validation/validation.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly validationService: ValidationService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(req: RegisterRequest): Promise<void> {
    const registerRequest = this.validationService.validate<RegisterRequest>(
      AuthValidation.REGISTER,
      req,
    );

    const emailCount = await this.userRepository.count({
      where: { email: registerRequest.email },
    });

    if (emailCount > 0) {
      throw new BadRequestException('email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(registerRequest.password, 10);

    const user = this.userRepository.create({
      name: registerRequest.name,
      email: registerRequest.email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
  }

  async login(req: LoginRequest): Promise<LoginResponse> {
    const loginRequest = this.validationService.validate<LoginRequest>(
      AuthValidation.LOGIN,
      req,
    );

    const user = await this.userRepository.findOne({
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
