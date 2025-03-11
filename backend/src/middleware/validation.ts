import { Request, Response, NextFunction } from 'express';

export const validateGenerateEmoji = (req: Request, res: Response, next: NextFunction) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid input',
      details: 'Text prompt is required and must be a string',
    });
  }

  if (text.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input',
      details: 'Text prompt must be less than 100 characters',
    });
  }

  next();
}; 