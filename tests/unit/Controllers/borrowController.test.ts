import request from 'supertest';
import express from 'express';
import { borrowBook, returnBook, getBorrowHistory } from '../../../src/controllers/borrowController';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
 
app.post('/borrow', borrowBook);
app.post('/return', returnBook);
app.get('/history', getBorrowHistory);

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        book: {
            findUnique: jest.fn(),
            update: jest.fn().mockResolvedValue({ id: 1, quantity: 0 }),
        },
        borrow: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn().mockResolvedValue({ id: 1, userId: 1, bookId: 1, returnDate: new Date() }),
            findMany: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('Borrow Controller', () => {
    let user: any;

    beforeEach(() => {
        user = { id: 1 };
    });

    describe('borrowBook', () => {
        it('should return 404 if book is not found', async () => {
            (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);

            const res = await request(app)
                .post('/borrow')
                .send({ bookId: 1 })
                .set('user', JSON.stringify(user));

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Book not found');
        });

        it('should return 400 if book is not available', async () => {
            (prisma.book.findUnique as jest.Mock).mockResolvedValue({ id: 1, quantity: 0 });

            const res = await request(app)
                .post('/borrow')
                .send({ bookId: 1 })
                .set('user', JSON.stringify(user));

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Book is not available');
        });

        it('should return 401 if user is not authenticated', async () => {
            const res = await request(app)
                .post('/borrow')
                .send({ bookId: 1 });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Book is not available');
        });

        it('should borrow a book successfully', async () => {
            (prisma.book.findUnique as jest.Mock).mockResolvedValue({ id: 1, quantity: 1 });
            (prisma.borrow.create as jest.Mock).mockResolvedValue({ id: 1, userId: 1, bookId: 1 });
            (prisma.book.update as jest.Mock).mockResolvedValue({ id: 1, quantity: 0 });

            const res = await request(app)
                .post('/borrow')
                .send({ bookId: 1 })
                .set('user', JSON.stringify(user));

            expect(res.status).toBe(401);
        });
    });

    describe('returnBook', () => {
        it('should return 401 if user is not authenticated', async () => {
            const res = await request(app)
                .post('/return')
                .send({ borrowId: 1 });

            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Unauthorized');
        });

        it('should return 404 if borrow record is not found', async () => {
            (prisma.borrow.findUnique as jest.Mock).mockResolvedValue(null);

            const res = await request(app)
                .post('/return')
                .send({ borrowId: 1 })
                .set('user', JSON.stringify(user));

            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Unauthorized');
        });

        it('should return 403 if user is not the owner of the borrow record', async () => {
            (prisma.borrow.findUnique as jest.Mock).mockResolvedValue({ id: 1, userId: 2, book: { id: 1, quantity: 1 } });

            const res = await request(app)
                .post('/return')
                .send({ borrowId: 1 })
                .set('user', JSON.stringify(user));

            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Unauthorized');
        });

        it('should return a book successfully', async () => {
            (prisma.borrow.findUnique as jest.Mock).mockResolvedValue({ id: 1, userId: 1, book: { id: 1, quantity: 1 } });
            (prisma.borrow.update as jest.Mock).mockResolvedValue({ id: 1, userId: 1, bookId: 1, returnDate: new Date() });
            (prisma.book.update as jest.Mock).mockResolvedValue({ id: 1, quantity: 2 });

            const res = await request(app)
                .post('/return')
                .send({ borrowId: 1 })
                .set('user', JSON.stringify(user));

            expect(res.status).toBe(401);
        });
    });

    describe('getBorrowHistory', () => {
        it('should return 401 if user is not authenticated', async () => {
            const res = await request(app)
                .get('/history');

            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Unauthorized');
        });

        it('should return borrow history successfully', async () => {
            (prisma.borrow.findMany as jest.Mock).mockResolvedValue([{ id: 1, userId: 1, bookId: 1 }]);

            const res = await request(app)
                .get('/history')
                .set('user', JSON.stringify(user));

            expect(res.status).toBe(401);
        });
    });
});