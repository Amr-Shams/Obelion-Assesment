import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { isValidCredentials } from '../utils/validators';
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, name } = req.body;

        if (!isValidCredentials(email, password)) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name },
        });

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.status(200).json({ user, token });
    } catch (error) {
        next(error);
    }
};