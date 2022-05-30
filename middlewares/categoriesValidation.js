import Joi from "joi";
import database from "../database.js";

export async function categoryValidation(req, res, next) {
    const { name } = req.body;

    const isThisName = await database.query(`SELECT * FROM categories WHERE name = $1`, [name]);
    if (isThisName.rows.length !== 0) {
        return res.status(409).send("Já existe uma categoria com esse nome");
    }

    const nameSchema = Joi.object({
        name: Joi.string().min(1).required()
    });

    const validation = nameSchema.validate({name});

    if(validation.error) {
        return res.status(400).send("O nome da categoria não pode ser vazio!");
    }


    next();

}
