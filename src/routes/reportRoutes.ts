import { Router } from 'express';
import { getBorrowedBooksReport, getPopularBooksReport } from '../controllers/reportController';
import { authenticateToken } from '../middleware/authenticateToken'; 
import { isAdmin } from '../middleware/isAdmin';

const router = Router();

/**
 * @swagger
 * /api/reports/borrowed:
 *   get:
 *     summary: Get a report of borrowed books
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Borrowed books report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   bookId:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   borrowCount:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/borrowed', authenticateToken, isAdmin, getBorrowedBooksReport);

/**
 * @swagger
 * /api/reports/popular:
 *   get:
 *     summary: Get a report of popular books
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Popular books report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   bookId:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   borrowCount:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/popular', authenticateToken, isAdmin, getPopularBooksReport);

export default router;