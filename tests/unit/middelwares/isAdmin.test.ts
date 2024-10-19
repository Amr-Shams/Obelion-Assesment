import { Request, Response, NextFunction } from 'express';
import { isAdmin } from '../../../src/middleware/isAdmin';

describe('isAdmin Middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should call next if user is admin', () => {
        req.user = { isAdmin: true };

        isAdmin(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', () => {
        req.user = { isAdmin: false };

        isAdmin(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Admin access required' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user is not present', () => {
        isAdmin(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Admin access required' });
        expect(next).not.toHaveBeenCalled();
    });
});