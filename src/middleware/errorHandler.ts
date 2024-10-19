import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) : void=> {
  if (err.isJoi) {
   res.status(400).json({ error: err.details[0].message });
    return;
  }
  console.log(err);
  res.status(500).json({ error: 'Internal server error' });
};