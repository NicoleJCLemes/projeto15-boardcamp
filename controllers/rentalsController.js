import database from "../database.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
    const customerIdQuery = req.query.customerId;
    const gameIdQuery = req.query.gameId;

    try {
        
        if(customerIdQuery){
            const customer = await database.query(`
            SELECT rentals.*, customers.name as "customerName", games.name as "gameName", games."categoryId", categories."name" as "categoryName" FROM rentals
            JOIN customers
            ON rentals."customerId" = customers.id
            JOIN games
            ON rentals."gameId" = games.id
            JOIN categories
            ON games."categoryId" = categories.id
            WHERE "customerId" = $1`, [customerIdQuery]);

            if (customer.rows.length === 0) {
                return res.send([]);
            }

            let allRentalsCustomerArray = []

            customer.rows.forEach((client) => {
                let {id, customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee, customerName, gameName, categoryId, categoryName} = client;

                let rentalsCustomerObject = {
                    id,
                    customerId,
                    gameId,
                    rentDate,
                    daysRented,
                    returnDate,
                    originalPrice,
                    delayFee,
                    customer: {
                        id: customerId,
                        name: customerName
                    },
                    game: { 
                        id: gameId,
                        name: gameName,
                        categoryId,
                        categoryName
                    }
                }

                allRentalsCustomerArray = [...allRentalsCustomerArray, rentalsCustomerObject]

            })

            return res.send(allRentalsCustomerArray);
            
        }
        
        if (gameIdQuery) {
            const games = await database.query(`
            SELECT rentals.*, customers.name as "customerName", games.name as "gameName", games."categoryId", categories."name" as "categoryName" FROM rentals
            JOIN customers
            ON rentals."customerId" = customers.id
            JOIN games
            ON rentals."gameId" = games.id
            JOIN categories
            ON games."categoryId" = categories.id 
            WHERE "gameId" = $1`, [gameIdQuery]);

            if (games.rows.length === 0) {
                return res.send([]);
            }

            let allRentalsGameArray = []

            games.rows.forEach((game) => {
                let {id, customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee, customerName, gameName, categoryId, categoryName} = game;

                let rentalsGameObject = {
                    id,
                    customerId,
                    gameId,
                    rentDate,
                    daysRented,
                    returnDate,
                    originalPrice,
                    delayFee,
                    customer: {
                        id: customerId,
                        name: customerName
                    },
                    game: { 
                        id: gameId,
                        name: gameName,
                        categoryId,
                        categoryName
                    }
                }

                allRentalsGameArray = [...allRentalsGameArray, rentalsGameObject]

            })

            return res.send(allRentalsGameArray);

        } 
        
        if (!customerIdQuery && !gameIdQuery) {
            const customers = await database.query(`
            SELECT rentals.*, customers.name as "customerName", games.name as "gameName", games."categoryId", categories."name" as "categoryName" FROM rentals
            JOIN customers
            ON rentals."customerId" = customers.id
            JOIN games
            ON rentals."gameId" = games.id
            JOIN categories
            ON games."categoryId" = categories.id
            `);

            if (customers.rows.length === 0) {
                return res.send([]);
            }

            let allRentalsArray = []

            customers.rows.forEach((customer) => {
                let {id, customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee, customerName, gameName, categoryId, categoryName} = customer;

                let rentalsObject = {
                    id,
                    customerId,
                    gameId,
                    rentDate,
                    daysRented,
                    returnDate,
                    originalPrice,
                    delayFee,
                    customer: {
                        id: customerId,
                        name: customerName
                    },
                    game: { 
                        id: gameId,
                        name: gameName,
                        categoryId,
                        categoryName
                    }
                }

                allRentalsArray = [...allRentalsArray, rentalsObject]

            })

            return res.send(allRentalsArray);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("N??o foi poss??vel buscar os clientes!");
    }
}

export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    const rentDate = dayjs().format('YYYY/MM/DD');

    const game = await database.query(`SELECT * FROM games WHERE id = $1`, [gameId]);
    const price = game.rows[0].pricePerDay;

    const originalPrice = daysRented*price;

    try {

        await database.query(`
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7)`, [customerId, gameId, rentDate, daysRented, null, originalPrice, null]);
        res.status(201).send("Joguinho alugado com sucesso!")

    } catch (error) {

        console.log(error);
        res.status(500).send("Erro no processamento do aluguel!");

    }
}

export async function finalizeRental(req, res) {
    const { id } = req.params;
    const returnDate = dayjs().format('YYYY/MM/DD');

    try {
        
        const rental = await database.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
    
        const rentDate = dayjs(rental.rows[0].rentDate).format('YYYY/MM/DD');
        const rightReturnDate = dayjs(rentDate).add(3, 'day').format('YYYY/MM/DD');
        const delay = (dayjs(returnDate).valueOf() - dayjs(rightReturnDate).valueOf())/(1000 * 3600 * 24);
        let delayFee = 0
        
        if (delay >= 0) {
            delayFee = delay*rental.rows[0].originalPrice/rental.rows[0].daysRented;
        }
    
        await database.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`, 
        [returnDate, delayFee, id]);
        
        res.status(200).send("Joguinho devolvido com sucesso!");

    } catch (error) {

        console.log(error);
        res.status(500).send("Erro na finaliza????o do aluguel!");

    }

}

export async function deleteRental(req, res) {
    const { id } = req.params

    try {
        
        const rental = await database.query(`DELETE FROM rentals WHERE id = $1`, [id]);
        res.status(200).send("Aluguel deletado com sucesso!");

    } catch (error) {

        console.log(error);
        res.status(500).send("N??o foi poss??vel deletar o aluguel!")

    }
}