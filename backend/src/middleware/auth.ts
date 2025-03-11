import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret is not defined');
    }

    const decoded = jwt.verify(token, secret) as { id: string };
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
}; 