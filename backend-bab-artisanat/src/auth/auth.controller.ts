import { Controller, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string }) {
    try {
      const { name, email, password } = body;
      const result = await this.authService.register(name, email, password);
      return { message: 'User registered successfully', token: result.token };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const { token, userId } = await this.authService.login(loginDto.email, loginDto.password);
    return { token, userId };
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
