import Joi from "joi";
import database from "../database.js";

export async function postGameValidation(req, res, next) {
    const body = req.body;

    const isName = await database.query(`SELECT * FROM games WHERE name = $1`, [body.name]);

    if (isName.rows.length !== 0) {
        return res.status(409).send("Esse jogo já existe, adicione outro!");
    }

    const isCategory = await database.query(`SELECT * FROM categories WHERE id = $1`, [body.categoryId]);

    if (isCategory.rows.length === 0) {
        return res.status(400).send("Categoria inexistente, escolha outra!");
    }
    
    const gameSchema = Joi.object({
        name: Joi.string().min(1).required(),
        image: Joi.string().required(), // tentar validar o início como 'http...'
        stockTotal: Joi.number().greater(0).required(),
        pricePerDay: Joi.number().greater(0).required(),
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