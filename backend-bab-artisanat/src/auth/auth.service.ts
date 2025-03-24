import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schemas/user.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(name: string, email: string, password: string, role: string = 'client'): Promise<{ token: string }> {
    // Check if the user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ name, email, password: hashedPassword, role });
    await user.save();
  
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);
  
    return { token };
  }
  

  async login(email: string, password: string): Promise<{ token: string, userId: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);
  
    return { token, userId: user._id.toString() };  
  }
  


  async findUserById(userId: string): Promise<User | null> {
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new NotFoundException('ID utilisateur invalide');
    }
    return this.userModel.findById(userId).select('-password').exec(); 
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true }).exec();
    if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
}
}
