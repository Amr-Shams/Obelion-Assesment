import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export function validateRequest(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        res.status(400).json({
          error: error.details.map((detail) => detail.message).join(', '),
        });
      } else {
        next();
      }
    };
  }