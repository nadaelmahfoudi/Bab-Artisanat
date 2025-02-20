import { Controller, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string }) {
    const { name, email, password } = body;
    return this.authService.register(name, email, password);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ token: string }> {
    return this.authService.login(email, password);
  }

    // Request password reset
    @Post('request-password-reset')
    async requestPasswordReset(@Body('email') email: string): Promise<void> {
      return this.authService.requestPasswordReset(email);
    }
  
    // Reset password
    @Post('reset-password/:token')
    async resetPassword(
      @Param('token') token: string,
      @Body('newPassword') newPassword: string,
    ): Promise<void> {
      return this.authService.resetPassword(token, newPassword);
    }
}
