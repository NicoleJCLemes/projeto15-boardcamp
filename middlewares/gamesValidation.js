import Joi from "joi";
import database from "../database.js";

export async function postGameValidation(req, res, next) {
    const body = req.body;

    const isName = await database.query(`SELECT * FROM games WHERE name = $1`, [body.name]);

    if (isName.rows.length !== 0) {
        return res.status(409).send("Esse jogo já existe, adicione outro!");
    }
    
    const gameSchema = Joi.object({
        name: Joi.string().min(1).required(),
        image: Joi.string().required(),
        stockTotal: Joi.number().min(0).required(),
        pricePerDay: Joi.number().min(0).required(),
        categoryId: Joi.number().required()
    });

    const validation = gameSchema.validate(body);

    if (validation.error) {
        return res.status(400).send({
            error: validation.error.details.map((err) => err.message)
        });
    }

    next();
}