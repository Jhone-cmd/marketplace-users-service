import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { User } from '../users/entities/user.entity.js';
import { UserRole } from '../users/enums/user-role.enum.js';
import { UserStatus } from '../users/enums/user-status.enum.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';


describe('AuthController', () => {
  let authController: AuthController;
  let authService: {
    register: ReturnType<typeof vi.fn>;
  };

  const registerDto: RegisterDto = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'João',
    lastName: 'Silva',
    role: UserRole.BUYER,
  };

  const mockUser: User = {
    id: 'uuid-123',
    email: registerDto.email,
    password: '$2a$10$hashedpassword',
    firstName: registerDto.firstName,
    lastName: registerDto.lastName,
    role: UserRole.BUYER,
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    authService = {
      register: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('should call authService.register with the correct DTO and return the result', async () => {
      authService.register.mockResolvedValue(mockUser);

      const result = await authController.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('validateToken', () => {
    it('should return userId, email and role from the authenticated user', () => {
      const mockRequest = {
        user: {
          id: 'uuid-123',
          email: 'test@example.com',
          role: 'buyer',
        },
      } as unknown as import('express').Request;

      const result = authController.validateToken(mockRequest);

      expect(result).toEqual({
        userId: 'uuid-123',
        email: 'test@example.com',
        role: 'buyer',
      });
    });

    it('should map id to userId correctly', () => {
      const mockRequest = {
        user: {
          id: 'another-uuid-456',
          email: 'other@example.com',
          role: 'seller',
        },
      } as unknown as import('express').Request;

      const result = authController.validateToken(mockRequest);

      expect(result.userId).toBe('another-uuid-456');
      expect(result).not.toHaveProperty('id');
    });
  });
});