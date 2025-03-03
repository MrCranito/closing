import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { User } from '../../users/entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto
  ): Promise<{ token: string; user: User }> {
    return this.authService.login(loginDto);
  }

  @Post('verify-email')
  async verifyEmail(@Query('token') token: string): Promise<void> {
    return this.authService.verifyEmail(token);
  }

  @Post('email-verification')
  async resendVerificationEmail(@Body('email') email: string): Promise<void> {
    return this.authService.resendVerificationEmail(email);
  }

  @Post('forgot-password')
  async requestPasswordReset(@Body('email') email: string): Promise<void> {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string
  ): Promise<void> {
    return this.authService.resetPassword(token, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string
  ): Promise<void> {
    return this.authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateUser(
    @Request() req,
    @Body() updateDto: UpdateUserDto
  ): Promise<User> {
    return this.authService.updateUser(req.user.id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validateToken(@Request() req): Promise<User> {
    return this.authService.validateUser(req.user.id);
  }
}
