import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  
  export async function sendBorrowNotification(userEmail: string, bookTitle: string) {
    await transporter.sendMail({
      from:process.env.SMTP_USER,
      to: userEmail,
      subject: "Book Borrowed",
      text: `You have successfully borrowed the book: ${bookTitle}`,
      html: `<b>You have successfully borrowed the book: ${bookTitle}</b>`,
    });
  }
  
  export async function sendReturnNotification(userEmail: string, bookTitle: string) {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: userEmail,
      subject: "Book Returned",
      text: `You have successfully returned the book: ${bookTitle}`,
      html: `<b>You have successfully returned the book: ${bookTitle}</b>`,
    });
  }
export const sendBorrowNotificationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = res.locals.book;
    if (book) {
      await sendBorrowNotification(req.user!.email, book.title);
    }
  } catch (error) {
    next(error);
  }
};

export const sendReturnNotificationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = res.locals.book
    console.log(book.title, req.user!.email);
    if (book) {
      await sendReturnNotification(req.user!.email, book.title);
    }
  } catch (error) {
    next(error);
  }
};