import { Router } from 'express';
import { postGameValidation, getGameValidation } from '../middlewares/gamesValidation.js';
import { getGames, postGame } from '../controllers/gamesController.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGameValidation, getGames);
gamesRouter.post('/games', postGameValidation, postGame);

export default gamesRouter