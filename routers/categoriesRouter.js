import { Router } from 'express';
import { getCategories, postCategory } from '../controllers/categoriesController.js';
import { categoryValidation } from '../middlewares/categoriesValidation.js';

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);
categoriesRouter.post('/categories', categoryValidation, postCategory);

export default categoriesRouter