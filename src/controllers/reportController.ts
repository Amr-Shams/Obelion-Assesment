import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBorrowedBooksReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const borrowedBooks = await prisma.borrow.findMany({
      where: { returnDate: null },
      include: { book: true, user: true },
    });
    res.json(borrowedBooks);
  } catch (error) {
    next(error);
  }
};

export const getPopularBooksReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const popularBooks = await prisma.book.findMany({
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
    res.json(popularBooks);
  } catch (error) {
    next(error);
  }
};