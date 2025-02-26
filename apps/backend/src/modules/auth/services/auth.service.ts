import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(email: string, password: string) {
    const user = await this.usersService.findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException('User already exists');
    }

    await this.usersService.createOne({
      email,
      password,
    });
    return { message: 'User registered' };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return { token, user };
  }

  async updatePassword(id: number, password: string) {
    await this.usersService.updateOne(id, { password });
    return { message: 'Password updated' };
  }

  async refresh(token: string) {
    const payload = this.jwtService.verify(token);
    const user = await this.usersService.findOne({ where: { id: payload.id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.jwtService.sign({ id: user.id, email: user.email });
  }

  async sendVerificationEmail(email: string) {
    const user = await this.usersService.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const url =
      process.env.FRONTEND_URL + `api/auth/verifiying-account/${user.id}`;

    return url;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersService.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async verifyEmail(email: string) {
    const user = await this.usersService.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    await this.usersService.updateOne(user.id, { isEmailVerified: true });

    return { message: 'Email verified' };
  }
}
