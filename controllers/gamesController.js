import database from "../database.js";

export async function getGames(req, res) {
    const { name } = req.query;

    try {
        
        if(name){
            //name = name.toUpperCase();
            const games = await database.query(`SELECT * FROM games WHERE name LIKE '${name}%'`);
            return res.send(games.rows);
        } else {
            const allGames = await database.query("SELECT * FROM games");
            return res.send(allGames.rows);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Não foi possível buscar os jogos disponíveis!");
    }

}

export async function postGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {

        await database.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`,
        [name, image, stockTotal, categoryId, pricePerDay]);

        res.status(201).send("Jogo adicionado com sucesso!");

    } catch (error) {
        
        console.log(error);
        res.status(500).send("Não foi possível adicionar o jogo!");

    }
}