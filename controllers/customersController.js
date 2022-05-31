import database from "../database.js";

export async function getCustomers(req, res) {
    const { cpf } = req.query;

    try {
        
        if(cpf){
            //name = name.toUpperCase();
            const customers = await database.query(`SELECT * FROM customers WHERE cpf LIKE '${cpf}%'`);
            return res.send(customers.rows);
        } else {
            const allCustomers = await database.query("SELECT * FROM customers");
            return res.send(allCustomers.rows);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Não foi possível buscar os clientes!");
    }
}

export async function getOneCustomer(req, res) {
    const { id } = req.params

    try {
        const costumer = await database.query(`SELECT * FROM customers WHERE id = ${id}`);
        return res.send(costumer.rows);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Não foi possível buscar esse cliente!");

    }
}

export async function addOneCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        
        await database.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
        [name, phone, cpf, birthday]);

        return res.status(201).send("Cliente adicionado com sucesso!");

    } catch (error) {

        console.log(error);
        return res.status(500).send("Não foi possível adicionar o cliente!");

    }

}

export async function updateOneCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {
        
        await database.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`,
        [name, phone, cpf, birthday, id]);

        return res.status(200).send("Dados do cliente atualizados com sucesso!");

    } catch (error) {

        console.log(error);
        return res.status(500).send("Não foi possível atualizar os dados!");

    }

}