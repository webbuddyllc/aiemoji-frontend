import { Router } from 'express';
import { generateEmoji } from '../controllers/emoji.controller';
import { validateGenerateEmoji } from '../middleware/validation';

const router = Router();

// Generate emoji route with validation middleware
router.post('/generate', validateGenerateEmoji, generateEmoji);

export default router; 