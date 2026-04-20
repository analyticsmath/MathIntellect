import { Injectable, UnauthorizedException } from '@nestjs/common';
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
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthSessionResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const user = await this.usersService.create({
      name: dto.name.trim(),
      email: normalizedEmail,
      password: dto.password,
    });

    return this.createSession(user);
  }

  async login(dto: LoginDto): Promise<AuthSessionResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(normalizedEmail);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await user.validatePassword(dto.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.createSession(user);
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
}
