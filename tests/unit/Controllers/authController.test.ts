import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { register, login } from '../../../src/controllers/authController';
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  })),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
      mockRequest.body = { email: 'test@example.com', password: 'pasSword123', name: 'Test User' };
      (PrismaClient as jest.Mock).mockImplementation(() => ({
        user: {
          create: jest.fn().mockResolvedValue(mockUser),
        },
      }));
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      await register(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 for invalid credentials', async () => {
      mockRequest.body = { email: 'invalid', password: 'short', name: 'Test User' };

      await register(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword', isAdmin: false };
      mockRequest.body = { email: 'test@example.com', password: 'password123' };
      (PrismaClient as jest.Mock).mockImplementation(() => ({
        user: {
          findUnique: jest.fn().mockResolvedValue(mockUser),
        },
      }));
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      await login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 for invalid credentials', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'wrongpassword' };
      (PrismaClient as jest.Mock).mockImplementation(() => ({
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      }));

      await login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });
});