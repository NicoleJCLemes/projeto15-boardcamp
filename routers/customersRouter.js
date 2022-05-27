import { Router } from 'express';
import { getCustomersValidation, getOneCustomerValidation, addOneCustomerValidation, updateOneCustomerValidation } from '../middlewares/customersValidation.js';
import { getCustomers, getOneCustomer, addOneCustomer, updateOneCustomer } from '../controllers/customersController.js';

const customersRouter = Router();

customersRouter.get('/customers', getCustomersValidation, getCustomers);
customersRouter.get('/customers/:id', getOneCustomerValidation, getOneCustomer);
customersRouter.post('/customers', addOneCustomerValidation, addOneCustomer);
customersRouter.put('/customers/:id', updateOneCustomerValidation, updateOneCustomer);

export default customersRouter