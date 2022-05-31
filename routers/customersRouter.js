import { Router } from 'express';
import { getOneCustomerValidation, addOneCustomerValidation, updateOneCustomerValidation } from '../middlewares/customersValidation.js';
import { getCustomers, getOneCustomer, addOneCustomer, updateOneCustomer } from '../controllers/customersController.js';

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getOneCustomerValidation, getOneCustomer);
customersRouter.post('/customers', addOneCustomerValidation, addOneCustomer);
customersRouter.put('/customers/:id', updateOneCustomerValidation, updateOneCustomer);

export default customersRouter