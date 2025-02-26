import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { AuthService } from './../services/auth.service';
import { JwtAuthGuard } from './../jwt-auth.guard';
import { User } from '../../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  login(
    @Body() body: { email: string; password: string }
  ): Promise<{ token: string; user: User }> {
    return this.authService.login(body.email, body.password);
  }

  @Patch('update-password/:id')
  updatePassword(@Param() id: number, @Body() body: { password: string }) {
    return this.authService.updatePassword(id, body.password);
  }

  @Post('send-email-verification')
  sendVerificationEmail(@Body() body: { email: string }) {
    return this.authService.sendVerificationEmail(body.email);
  }

  @Post('verify-email')
  verifyEmail(@Body() body: { email: string }) {
    return this.authService.verifyEmail(body.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  validateToken(@Request() req) {
    return this.authService.getUserByEmail(req.user.email);
  }
}
