import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { bookSchema } from '../utils/validation';

const prisma = new PrismaClient();

export const addBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, author, published_year, isbn, quantity } = req.body;
    const { error } = bookSchema.validate({ title, author, published_year, isbn, quantity });
    if (error) {
      return next(error);
    }

    const book = await prisma.book.create({
        data: { title, author, published_year, isbn, quantity },
    });
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, author, published_year, isbn, quantity } = req.body;
    const { error } = bookSchema.validate({ title, author, published_year, isbn, quantity });
    if (error) {
      return next(error);
    }

    const book = await prisma.book.update({
      where: { id: parseInt(id) },
      data: { title, author, published_year, isbn, quantity },
    });
    res.json(book);
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.book.delete({
      where: { id: parseInt(id) },
    });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const getBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, author, available } = req.query;

    const filters: any = {};

    if (title) {
      filters.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    if (author) {
      filters.author = {
        contains: author,
        mode: 'insensitive',
      };
    }

    if (available !== undefined) {
      filters.quantity = {
        gt: 0,
      };
    }

    const books = await prisma.book.findMany({
      where: filters,
    });

    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const book = await prisma.book.findUnique({
        where: { id: parseInt(id) },
      });
      if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }
      res.json(book);
    } catch (error) {
      next(error);
    }
  };