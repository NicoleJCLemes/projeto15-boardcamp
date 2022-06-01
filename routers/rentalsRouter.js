import { Router } from 'express';
import { postRentalsValidation, finalizeRentalValidation, deleteRentalValidation } from '../middlewares/rentalsValidation.js';
import { getRentals, postRentals, finalizeRental, deleteRental } from '../controllers/rentalsController.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', postRentalsValidation, postRentals);
rentalsRouter.post('/rentals/:id/return', finalizeRentalValidation, finalizeRental);
rentalsRouter.delete('/rentals/:id', deleteRentalValidation, deleteRental);

export default rentalsRouter