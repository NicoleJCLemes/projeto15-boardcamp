import { Router } from 'express';
import { postGameValidation } from '../middlewares/gamesValidation.js';
import { getGames, postGame } from '../controllers/gamesController.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games', postGameValidation, postGame);

export default gamesRouter