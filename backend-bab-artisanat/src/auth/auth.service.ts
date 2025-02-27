import { Injectable, BadRequestException, UnauthorizedException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schemas/user.schema';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(name: string, email: string, password: string): Promise<{ token: string }> {
    // Check if the user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const user = new this.userModel({ name, email, password: hashedPassword });
    await user.save();

    
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT payload and token
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    // Generate a reset token with a short expiration time
    const resetToken = this.jwtService.sign({ sub: user._id }, { expiresIn: '2h' });

    // Send reset token to user's email
    const resetLink = `http://localhost:3000/auth/reset-password/${resetToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      template: 'reset-password',  // Create a reset-password.hbs template
      context: { resetLink },
    });

    return; 
  }

  // Reset Password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    let userId: string;
    
    try {
      // Verify token and extract userId
      const decoded = this.jwtService.verify(token);
      userId = decoded.sub;
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }

    // Find user and update the password
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Save updated user
    await user.save();
  }
}
