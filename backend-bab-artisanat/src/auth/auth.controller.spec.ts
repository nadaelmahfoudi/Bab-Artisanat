import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn().mockResolvedValue({ token: 'fake-token' }),
    login: jest.fn().mockResolvedValue({ token: 'fake-token', userId: '123', role: 'user' }),
    findUserById: jest.fn().mockImplementation((id) => {
      if (id === '1') return { id: '1', name: 'John Doe', email: 'john@example.com' };
      return null;
    }),
    updateUser: jest.fn().mockResolvedValue({ id: '1', name: 'Updated User' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should register a user', async () => {
    const result = await authController.register({ name: 'John', email: 'test@example.com', password: '123456' });
    expect(result).toEqual({ message: 'User registered successfully', token: 'fake-token' });
    expect(mockAuthService.register).toHaveBeenCalledWith('John', 'test@example.com', '123456', undefined);
  });

  it('should throw BadRequestException if registration fails', async () => {
    mockAuthService.register.mockRejectedValueOnce(new Error('Registration failed'));
    await expect(authController.register({ name: 'John', email: 'test@example.com', password: '123456' }))
      .rejects.toThrow(BadRequestException);
  });

  it('should login a user', async () => {
    const result = await authController.login({ email: 'test@example.com', password: '123456' });
    expect(result).toEqual({ token: 'fake-token', userId: '123', role: 'user' });
  });

  it('should get user by id', async () => {
    const result = await authController.getUserById('1');
    expect(result).toEqual({ message: 'Utilisateur récupéré avec succès', user: { id: '1', name: 'John Doe', email: 'john@example.com' } });
  });

  it('should throw NotFoundException if user is not found', async () => {
    await expect(authController.getUserById('999')).rejects.toThrow(NotFoundException);
  });

  it('should update a user', async () => {
    const result = await authController.updateUser('1', { name: 'Updated User' });
    expect(result).toEqual({ id: '1', name: 'Updated User' });
  });
});
