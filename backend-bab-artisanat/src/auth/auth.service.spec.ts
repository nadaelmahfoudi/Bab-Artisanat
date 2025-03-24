import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: any;
  let jwtService: JwtService;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'client',
    save: jest.fn().mockResolvedValue(this),
  };

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto) => ({
      ...dto,
      _id: mockUser._id,
      save: jest.fn().mockResolvedValue({ ...dto, _id: mockUser._id }),
    })),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailerService,
          useValue: { sendMail: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);

    // Fix: Properly type the mock implementations
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword'));
    jest.spyOn(bcrypt, 'compare').mockImplementation((pass, hash) => {
      return Promise.resolve(pass === 'password' && hash === mockUser.password);
    });

    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login a user and return a token, userId and role', async () => {
      userModel.findOne.mockResolvedValue(mockUser);

      const result = await service.login('test@example.com', 'password');

      expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({
        token: 'mockToken',
        userId: mockUser._id,
        role: mockUser.role,
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(
        service.login('wrong@example.com', 'password')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      userModel.findOne.mockResolvedValue(mockUser);

      await expect(
        service.login('test@example.com', 'wrongPassword')
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateUser', () => {
    it('should update a user and return the updated user', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.updateUser('507f1f77bcf86cd799439011', updateUserDto);

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateUserDto,
        { new: true }
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };

      await expect(
        service.updateUser('507f1f77bcf86cd799439012', updateUserDto)
      ).rejects.toThrow(NotFoundException);
    });
  });
});
