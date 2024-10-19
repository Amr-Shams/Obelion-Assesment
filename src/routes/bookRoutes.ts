import { Router } from 'express';
import { addBook, updateBook, deleteBook, getBooks, getBookById } from '../controllers/bookController';
import { validateRequest } from '../middleware/validator';
import { bookSchema } from '../utils/validation';
import { authenticateToken } from '../middleware/authenticateToken';
import { isAdmin } from '../middleware/isAdmin';


const router = Router();

/**
 * @swagger
 * /api/:
 *   get:
 *     summary: Retrieve a list of books with optional search and filtering
 *     tags: [Books]
 *     security:
 *          - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search by book title
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Search by book author
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filter by availability (true for available books)
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   published_year:
 *                     type: integer
 *                   isbn:
 *                     type: string
 *                   quantity:
 *                     type: integer
 */
router.get('/', authenticateToken, getBooks);

/**
 * @swagger
 * /api/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: The book description by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 author:
 *                   type: string
 *                 published_year:
 *                   type: integer
 *                 isbn:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *       404:
 *         description: Book not found
 */
router.get('/:id', authenticateToken, getBookById);

/**
 * @swagger
 * /api/:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticateToken, isAdmin, validateRequest(bookSchema), addBook);

/**
 * @swagger
 * /api/{id}:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Book not found
 */
router.put('/:id', authenticateToken, isAdmin, validateRequest(bookSchema), updateBook);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: The book was successfully deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Book not found
 */
router.delete('/:id', authenticateToken, isAdmin, deleteBook);

export default router;