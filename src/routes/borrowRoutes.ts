import { Router } from 'express';
import { borrowBook, returnBook, getBorrowHistory } from '../controllers/borrowController';
import { authenticateToken } from '../middleware/authenticateToken';
import {sendReturnNotificationMiddleware, sendBorrowNotificationMiddleware} from '../middleware/notificationMiddleware';

const router = Router();

/**
 * @swagger
 * /api/borrow:
 *   post:
 *     summary: Borrow a book
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: integer
 *                 description: The ID of the book to borrow
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 bookId:
 *                   type: integer
 *                 borrowDate:
 *                   type: string
 *                   format: date-time
 *                 returnDate:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
router.post('/borrow', authenticateToken, borrowBook, sendBorrowNotificationMiddleware);

/**
 * @swagger
 * /api/return:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               borrowId:
 *                 type: integer
 *                 description: The ID of the borrow record
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Borrow record not found
 */
router.post('/return', authenticateToken, returnBook, sendReturnNotificationMiddleware);

/**
 * @swagger
 * /api/borrow/history:
 *   get:
 *     summary: Get borrow history
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Borrow history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   bookId:
 *                     type: integer
 *                   borrowDate:
 *                     type: string
 *                     format: date-time
 *                   returnDate:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *       401:
 *         description: Unauthorized
 */
router.get('/borrow/history', authenticateToken, getBorrowHistory);

export default router;