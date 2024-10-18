import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const borrowBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bookId } = req.body;
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
     res.status(404).json({ error: 'Book not found' });
        return;
    }
    if (book.quantity <= 0) {
       res.status(400).json({ error: 'Book is not available' });
        return;
    }

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const borrow = await prisma.borrow.create({
      data: {
        userId: req.user.id,
        bookId: bookId,
      },
    });

    await prisma.book.update({
      where: { id: bookId },
      data: { quantity: book.quantity - 1 },
    });

    res.locals.book = book;
    res.json(borrow);
    next();
  } catch (error) {
    next(error);
  }
};

export const returnBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { borrowId } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const borrow = await prisma.borrow.findUnique({
      where: { id: borrowId },
      include: { book: true },
    });

    if (!borrow) {
      res.status(404).json({ error: 'Borrow record not found' });
      return;
    }

    if (borrow.userId !== req.user.id) {
      res.status(403).json({ error: 'You can only return books you have borrowed' });
      return;
    }

    await prisma.borrow.update({
      where: { id: borrowId },
      data: { returnDate: new Date() },
    });

   const book = await prisma.book.update({
      where: { id: borrow.bookId },
      data: { quantity: borrow.book.quantity + 1 },
    });
    res.locals.book = book;
    res.json(borrow);
    next();
  } catch (error) {
    next(error);
  }
};

export const getBorrowHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const borrows = await prisma.borrow.findMany({
      where: { userId: req.user.id },
    });

    res.json(borrows);
  } catch (error) {
    next(error);
  }
};
