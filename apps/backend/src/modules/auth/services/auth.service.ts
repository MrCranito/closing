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
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException('User already exists');
    }
    await this.usersService.createOne({
      email,
      password: hashedPassword,
    });
    return { message: 'User registered' };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return { token };
  }

  async refresh(token: string) {
    const payload = this.jwtService.verify(token);
    const user = await this.usersService.findOne({ where: { id: payload.id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.jwtService.sign({ id: user.id, email: user.email });
  }
}
