import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategies/jwt.strategy';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

export interface AuthSessionResponse {
  accessToken: string;
  user: AuthenticatedUser;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthSessionResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    try {
      const user = await this.usersService.create({
        name: dto.name.trim(),
        email: normalizedEmail,
        password: dto.password,
      });

      this.logger.log(`Registration succeeded for ${normalizedEmail}`);
      return this.createSession(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      this.logger.error(
        `Registration failed for ${normalizedEmail}: ${this.readableError(error)}`,
      );
      throw new InternalServerErrorException(
        'Unable to register at the moment. Please try again.',
      );
    }
  }

  async login(dto: LoginDto): Promise<AuthSessionResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    try {
      const user = await this.usersService.findByEmail(normalizedEmail);

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const valid = await user.validatePassword(dto.password);
      if (!valid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      this.logger.log(`Login succeeded for ${normalizedEmail}`);
      return this.createSession(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error(
        `Login failed for ${normalizedEmail}: ${this.readableError(error)}`,
      );
      throw new InternalServerErrorException(
        'Unable to login at the moment. Please try again.',
      );
    }
  }

  generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }

  private createSession(user: User): AuthSessionResponse {
    const token = this.generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  private readableError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
