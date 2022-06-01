import Joi from "joi";
import database from "../database.js";

export async function getOneCustomerValidation(req, res, next) {
    const { id } = req.params;

    const customer = await database.query(`SELECT * FROM customers WHERE id = ${id}`);

    if (customer.rows.length === 0) {
        return res.status(404).send("Esse cliente não foi encontrado!")
    }

    next();
}

export async function addOneCustomerValidation(req, res, next) {
    const body = req.body;
    
    const cpfTest = await database.query(`SELECT * FROM customers WHERE cpf = $1`, [body.cpf]);

    if (cpfTest.rows.length !== 0) {
        return res.status(409).send("Esse CPF já está cadastrado!");
    }

    const customerSchema = Joi.object({
        name: Joi.string().min(1).required(),
        phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
        cpf: Joi.string().pattern(/^[0-9]{11}$/).required(),
        birthday: Joi.date().iso()
    });

    const validation = customerSchema.validate(body);

    if(validation.error) {
        return res.status(400).send({
            error: validation.error.details.map((err) => err.message)
        });
    }


    next();
}

export async function updateOneCustomerValidation(req, res, next) {
    const { id } = req.params;
    const body = req.body;

    const cpfTest = await database.query(`SELECT * FROM customers WHERE cpf = $1`, [body.cpf]);

    if (cpfTest.rows.length !== 0 && parseInt(id) !== parseInt(cpfTest.rows[0].id)) {
        return res.status(409).send("Esse CPF já está cadastrado!");
    }

    const customerSchema = Joi.object({
        id: Joi.number(),
        name: Joi.string().min(1).required(),
        phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
        cpf: Joi.string().pattern(/^[0-9]{11}$/).required(),
        birthday: Joi.date().iso()
    });

    const validation = customerSchema.validate(body);

    if(validation.error) {
        return res.status(400).send({
            error: validation.error.details.map((err) => err.message)
        });
    }


    next();

}