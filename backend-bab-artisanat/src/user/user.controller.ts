import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: { name: string; email: string; password: string }) {
    return this.userService.createUser(body.name, body.email, body.password);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
