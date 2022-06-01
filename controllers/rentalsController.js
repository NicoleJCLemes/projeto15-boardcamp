import database from "../database.js";

export async function getRentals(req, res) {
    const { customerId, gameId } = req.query;

    try {
        
        if(customerId){
            const customer = await database.query(`
            SELECT rentals.*, customers.id, customers.name, games.id, games.name, games."categoryId", categories."name" as "categoryName" FROM rentals
            JOIN customers
            ON rentals."customerId" = customers.id
            JOIN games
            ON rentals."gameId" = games.id
            JOIN categories
            ON games."categoryId" = categories.id 
            WHERE "customerId" = $1`, [customerId]);
            return res.send(customer.rows);
        }
        
        if (gameId) {
            const games = await database.query(`
            SELECT rentals.*, customers.id, customers.name, games.id, games.name, games."categoryId", categories."name" as "categoryName" FROM rentals
            JOIN customers
            ON rentals."customerId" = customers.id
            JOIN games
            ON rentals."gameId" = games.id
            JOIN categories
            ON games."categoryId" = categories.id 
            WHERE "gameId" = $1`, [gameId]);
            return res.send(games.rows);
        } 
        
        if (!customerId || !gameId) {
            const customers = await database.query(`
            SELECT rentals.*, customers.id, customers.name, games.id, games.name, games."categoryId", categories."name" as "categoryName" FROM rentals
            JOIN customers
            ON rentals."customerId" = customers.id
            JOIN games
            ON rentals."gameId" = games.id
            JOIN categories
            ON games."categoryId" = categories.id
            `);
            return res.send(customers.rows);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Não foi possível buscar os clientes!");
    }
}

export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body
}

export async function finalizeRental(req, res) {
    
}

export async function deleteRental(req, res) {
    const { id } = req.params

    try {
        
        const rental = await database.query(`DELETE FROM rentals WHERE id = $1`, [id]);
        res.status(200).send("Aluguel deletado com sucesso!");

    } catch (error) {

        console.log(error);
        res.status(500).send("Não foi possível deletar o aluguel!")

    }
}