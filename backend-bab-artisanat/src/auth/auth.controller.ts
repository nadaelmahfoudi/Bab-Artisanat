import { Controller, Post, Body, Param, Get, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string; role?: string }) {
    try {
      const { name, email, password, role } = body;
      const result = await this.authService.register(name, email, password, role);  
      return { message: 'User registered successfully', token: result.token };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const { token, userId, role } = await this.authService.login(loginDto.email, loginDto.password);
    return { token, userId, role };  
  }
  


    @Get(':userId')
    async getUserById(@Param('userId') userId: string) {
      const user = await this.authService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }
      return { message: 'Utilisateur récupéré avec succès', user };
    }

    @Put(':id')
    async updateUser(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
        return this.authService.updateUser(userId, updateUserDto);
    }

}
