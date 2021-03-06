import Joi from "joi";
import database from "../database.js";

export async function postRentalsValidation(req, res, next) {
    const { customerId, gameId, daysRented } = req.body;

    const customer = await database.query(`SELECT * FROM customers WHERE id = $1`, [customerId]);
    if (customer.rows.length === 0) {
        return res.status(400).send("Cliente inexistente!");
    }

    const game = await database.query(`SELECT * FROM games WHERE id = $1`, [gameId]);
    if (game.rows.length === 0) {
        return res.status(400).send("Jogo inexistente!");
    }

    const rental = await database.query(`SELECT * FROM rentals WHERE "gameId" = $1`, [gameId]);
    if (rental.rows.length >= game.rows[0].stockTotal) {
        return res.status(400).send("Jogo não disponível para aluguel!");
    }

    const rentalSchema = Joi.object({
        customerId: Joi.number().required(),
        gameId: Joi.number().required(),
        daysRented: Joi.number().greater(0).required()
    });

    const validation = rentalSchema.validate({
        customerId,
        gameId,
        daysRented
    });

    if (validation.error) {
        return res.status(400).send({
            error: validation.error.details.map((err) => err.message)
        });
    }

    next();
}

export async function finalizeRentalValidation(req, res, next) {
    const { id } = req.params;

    const rental = await database.query(`SELECT * FROM rentals WHERE id = $1`, [id]);

    if (rental.rows.length === 0) {
        return res.status(404).send("Aluguel inexistente!");
    }

    if (rental.rows[0].returnDate) {
        return res.status(400).send("Esse aluguel já foi finalizado!");
    }

    next();
}

export async function deleteRentalValidation(req, res, next) {
    const { id } = req.params;

    const rental = await database.query(`SELECT * FROM rentals WHERE id = $1`, [id]);

    if (rental.rows.length === 0) {
        return res.status(404).send("Aluguel inexistente!");
    }

    if (!rental.rows[0].returnDate) {
        return res.status(400).send("Esse aluguel ainda não foi finalizado!");
    }

    next();
}