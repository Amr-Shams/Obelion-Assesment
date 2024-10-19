import request from 'supertest';
import express, { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import { getBorrowedBooksReport, getPopularBooksReport } from '../../../src/controllers/reportController';

const prisma = new PrismaClient();
const app: Application = express();

app.get('/borrowed-books-report', getBorrowedBooksReport);
app.get('/popular-books-report', getPopularBooksReport);

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        borrow: {
            findMany: jest.fn().mockResolvedValue([]),
        },
        book: {
            findMany: jest.fn().mockResolvedValue([]),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('Report Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getBorrowedBooksReport', () => {
        it('should return a list of borrowed books', async () => {
            const mockBorrowedBooks = [
                { id: 1, book: { title: 'Book 1' }, user: { name: 'User 1' }, returnDate: null },
            ];
            (prisma.borrow.findMany as jest.Mock).mockResolvedValue(mockBorrowedBooks);

            const response = await request(app).get('/borrowed-books-report');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBorrowedBooks);
            expect(prisma.borrow.findMany).toHaveBeenCalledWith({
                where: { returnDate: null },
                include: { book: true, user: true },
            });
        });

        it('should handle errors', async () => {
            (prisma.borrow.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/borrowed-books-report');

            expect(response.status).toBe(500);
        });
    });

    describe('getPopularBooksReport', () => {
        it('should return a list of popular books', async () => {
            const mockPopularBooks = [
                { id: 1, title: 'Book 1', _count: { borrows: 10 } },
            ];
            (prisma.book.findMany as jest.Mock).mockResolvedValue(mockPopularBooks);

            const response = await request(app).get('/popular-books-report');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPopularBooks);
            expect(prisma.book.findMany).toHaveBeenCalledWith({
                orderBy: {
                    borrows: {
                        _count: 'desc',
                    },
                },
                take: 10,
                include: {
                    _count: {
                        select: { borrows: true },
                    },
                },
            });
        });

        it('should handle errors', async () => {
            (prisma.book.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/popular-books-report');

            expect(response.status).toBe(500);
        });
    });
});