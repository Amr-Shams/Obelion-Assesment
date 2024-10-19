import request from 'supertest';
import { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import { getBorrowedBooksReport, getPopularBooksReport } from '../../src/controllers/reportController';
import express from 'express';

const app: Application = express();
const prisma = new PrismaClient();

app.get('/borrowed-books-report', getBorrowedBooksReport);
app.get('/popular-books-report', getPopularBooksReport);

const generateRandomISBN = (): string => {
  return Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
};

describe('Report Controller Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.borrow.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('GET /borrowed-books-report', () => {
    it('should return a list of borrowed books', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'user@example.com',
          password: 'password',
          name: 'User',
        },
      });

      const book = await prisma.book.create({
        data: {
          title: 'Book 1',
          author: 'Author 1',
          isbn: generateRandomISBN(),
          published_year: 2021,
          quantity: 1,
        },
      });

      await prisma.borrow.create({
        data: {
          userId: user.id,
          bookId: book.id,
          returnDate: null,
        },
      });

      const response = await request(app).get('/borrowed-books-report');

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /popular-books-report', () => {
    it('should return a list of popular books', async () => {
      const book1 = await prisma.book.create({
        data: {
          title: 'Book 1',
          author: 'Author 1',
          isbn: generateRandomISBN(),
          published_year: 2021,
          quantity: 2,
        },
      });
      const book2 = await prisma.book.create({
        data: {
          title: 'Book 2',
          author: 'Author 2',
          isbn: generateRandomISBN(),
          published_year: 2021,
          quantity: 1,
        },
      });

      const user1 = await prisma.user.create({
        data: {
          email: 'user1@example.com',
          password: 'password',
          name: 'User 1',
        },
      });

      const user2 = await prisma.user.create({
        data: {
          email: 'user2@example.com',
          password: 'password',
          name: 'User 2',
        },
      });

      await prisma.borrow.createMany({
        data: [
          { bookId: book1.id, userId: user1.id },
          { bookId: book1.id, userId: user2.id },
          { bookId: book2.id, userId: user1.id },

        ],
      });

      const response = await request(app).get('/popular-books-report');

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
