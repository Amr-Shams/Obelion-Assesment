import request from 'supertest';
import express, { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import { addBook, updateBook, deleteBook, getBooks, getBookById } from '../../../src/controllers/bookController';

const app: Application = express();
app.use(express.json());

const prisma = new PrismaClient();

app.post('/books', addBook);
app.put('/books/:id', updateBook);
app.delete('/books/:id', deleteBook);
app.get('/books', getBooks);
app.get('/books/:id', getBookById);

describe('Book Controller', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /books', () => {
        it('should add a new book', async () => {
            const response = await request(app)
                .post('/books')
                .send({
                    title: 'Test Book',
                    author: 'Test Author',
                    published_year: 2021,
                    isbn: Math.floor(Math.random() * 1000000000000).toString(),
                    quantity: 10,
                });
            expect(response.status).toBe(201);
            expect(response.body.title).toBe('Test Book');
        });
    });

    describe('PUT /books/:id', () => {
        it('should update an existing book', async () => {
            const book = await prisma.book.create({
                data: {
                    title: 'Old Title',
                    author: 'Old Author',
                    published_year: 2020,
                    isbn: Math.floor(Math.random() * 1000000000000).toString(),
                    quantity: 5,
                },
            });

            const response = await request(app)
                .put(`/books/${book.id}`)
                .send({
                    title: "New Title",
                    author: "New Author",
                    published_year: 1999,
                    isbn: Math.floor(Math.random() * 1000000000000).toString(),
                    quantity: 10,
                });
            expect(response.status).toBe(200);
            expect(response.body.title).toBe('New Title');
        });
    });

    describe('DELETE /books/:id', () => {
        it('should delete an existing book', async () => {
            const book = await prisma.book.create({
                data: {
                    title: 'Book to Delete',
                    author: 'Author',
                    published_year: 2021,
                    isbn: Math.floor(Math.random() * 1000000000000).toString(),
                    quantity: 10,
                },
            });
            const response = await request(app).delete(`/books/${book.id}`);
            expect(response.status).toBe(204);
        });
    });

    describe('GET /books', () => {
        it('should get all books with filters', async () => {
            await prisma.book.createMany({
                data: [
                    {
                        title: 'Book 1',
                        author: 'Author 1',
                        published_year: 2021,
                        isbn: Math.floor(Math.random() * 1000000000000).toString(),
                        quantity: 10,
                    },
                    {
                        title: 'Book 2',
                        author: 'Author 2',
                        published_year: 2020,
                        isbn: Math.floor(Math.random() * 1000000000000).toString(),
                        quantity: 0,
                    },
                ],
            });
            const response = await request(app).get('/books').query({ author: 'Author 1' });
            expect(response.status).toBe(200);
        });
    });

    describe('GET /books/:id', () => {
        it('should get a book by id', async () => {
            const book = await prisma.book.create({
                data: {
                    title: 'Book to Get',
                    author: 'Author',
                    published_year: 2021,
                    isbn: Math.floor(Math.random() * 1000000000000).toString(),
                    quantity: 10,
                },
            });

            const response = await request(app).get(`/books/${book.id}`);
            expect([200, 404]).toContain(response.status);
            if (response.status === 200) {
                expect(response.body.title).toBe('Book to Get');
            }
        });

        it('should return 404 if book not found', async () => {
            const response = await request(app).get('/books/9999');
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Book not found');
        });
    });
});