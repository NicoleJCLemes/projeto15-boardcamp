import database from '../database.js'

export async function getCategories(req, res) {

    try {
        const categories = await database.query("SELECT * FROM categories");
        res.send(categories.rows);
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Ocorreu um erro ao buscar as categorias!");
    }

}

export async function postCategory(req, res) {
    const {name} = req.body;

    try {
        await database.query(`INSERT INTO categories (name) VALUES ($1)`, [name]);
        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.status(500).send("Ocorreu um erro ao inserir a categoria!");

    }
}