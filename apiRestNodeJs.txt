const { response, request } = require("express");
const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql2/promise");
const port = 3001;
const bluebird = require("bluebird");

let connection; //Variable para almacenar la conexión a la DB

//Configura el servidor para recibir dtos en formato Json
app.use(express.json());
app.use(cors({ origin: true }));

app.set('port', process.env.PORT || port)

//Aqui empieza inserción código Api Germán//
app.get("/obtener-productos-bd", async (request, response) => {
    const [rows, fields] = await connection.execute('SELECT * FROM products');
    response.json({ data: rows })
})

app.get("/obtener-vendedores-bd", async (request, response) => {
    const [rows2, fields2] = await connection.execute('SELECT * FROM users where role="Vendedor"');
    response.json({ data2: rows2 })
})

app.get("/obtener-venta-total", async (request, response) => {
    const [rows3, fields2] = await connection.execute('SELECT * FROM ventaTotal');
    response.json({ data3: rows3 })
})

app.post("/agregar-ventas", async (request, response) => {
    try {
        console.log(request.body)
        const { idProductos,
            nombreProducto,
            cantidadCompra,
            precioCantidadCompra,
            idVentaTotal,
            idCliente,
            nombreCliente,
            idVendedores,
            nombreVendedores,
            fechaVenta, estadoVenta} = request.body;

        await connection.execute(`insert into ventas(idProductos,
            nombreProducto,
            cantidadCompra,
            precioCantidadCompra,
            idVentaTotal,
            idCliente,
            nombreCliente,
            idVendedores,
            nombreVendedores,
            fechaVenta, estadoVenta) values (${idProductos},
                '${nombreProducto}',
                ${cantidadCompra},
                ${precioCantidadCompra},
                ${idVentaTotal},
                ${idCliente},
                '${nombreCliente}',
                ${idVendedores},
                '${nombreVendedores}',
                '${fechaVenta}',
                '${estadoVenta}'
            )`);
        response.json({ status: "ok" })
    }
    catch (error) {
        console.log(error);
        response.json(error);
    }
})

app.post("/venta-total", async (request, response) => {
    try {
        console.log(request.body)

        const { id,
            TotalVenta,
            cliente,
            idcliente,
            vendedor,
            idVendedor,
            fecha, estadoVenta } = request.body;

        await connection.execute(`insert into ventaTotal(id,
            TotalVenta,
            cliente,
            idcliente,
            vendedor,
            idVendedor,
            fecha, estadoVenta) values (${id},
                ${TotalVenta},
                '${cliente}',
                ${idcliente},
                '${vendedor}',
                ${idVendedor},
                '${fecha}',
                '${estadoVenta}'
            )`);

        response.json({ status: "ok" })

    }
    catch (error) {
        console.log(error);
        response.json(error);
    }

})

app.post("/actualizar-inventario", async (request, response) => {
    try {
        console.log(request.body)

        const { id, d } = request.body;

        await connection.execute(`update products set stock = ${d} where id=${id}`);

        response.json({ status: "ok" })

    }
    catch (error) {
        console.log(error);
        response.json(error);
    }

})




//Aquí termina codigo Api Germán//







app.get("/", (request, response) => {
    response.json("Backend misiontic Shop");
})

app.get("/get-products", async (request, response) => {
    const [rows, fields] = await connection.execute("SELECT * FROM products");

    console.log({
        data: rows
    });
    console.log(fields.length);

    response.json({ data: rows });
})


//Se añaden los Get de Jan
    
app.get("/get-users", async (request, response) => {
    const [rows, fields] = await connection.execute("SELECT * FROM users");
    response.json({ data: rows });

});
app.post("/add-users", async (req, res) => {
    try {
        // const {name, age, password, nickname} =req.body;
        const user = req.body;
        const name = user.name;
        const email = user.email;
        const role = user.role;
        await connection.execute(`INSERT INTO users(name ,email,role) VALUES('${name}','${email}','${role}')`);

        res.json({ status: "ok" });

    }
    catch (error) {
        console.log(error);
        res.json(error);
    }
})

app.put("/update-users", async (req, res) => {
    try {
        // const {name, age, password, nickname} =req.body;
        const user = req.body;
        const id = user.id;
        const name = user.name;
        const email = user.email;
        const role = user.role;
        await connection.execute(`UPDATE users SET name='${name}',email='${email}',role='${role}' WHERE id='${id}'`);

        res.json({ status: "ok" });

    }
    catch (error) {
        console.log(error);
        res.json(error);
    }
})

app.delete("/delete-users", async (req, res) => {
    try {
        const id = req.body.id;
        const [rows, fields] = await connection.execute(`DELETE FROM users where id = '${id}'`);
        res.json({ status: "ok" });
    }
    catch (error) {
        console.log(error);
        res.json(error);
    }

})




* app.get("/get-user", async (request, response) => {
    const email = request.query.email;
    const [rows, fields] = await connection.execute(`SELECT * FROM users WHERE email='${email}'`);
    response.json(rows[0]);
})

/* app.get("/get-user/:id", async (request, response) => {
    const id = request.query.id;
    const [rows, fields] = await connection.execute(`SELECT * FROM users WHERE email='${id}'`);
    response.json(rows[0]);
})  */

/* app.get("/get-product/:id"), async (request, response) => {
    const id = request.query.id;
    const [rows, fields] = await connection.execute(`SELECT*FROM products WHERE id='${id}'`);
    console.log(request.id)
    response.json(rows[0]);

} */

app.post("/add-product", async (request, response) => {
    try {
        console.log(request.body)
        const { name, price, stock, description, status } = request.body;
        await connection.execute(`INSERT INTO products(name, price, stock, description, status) VALUES ('${name}', ${price}, ${stock},'${description}', '${status}')`);
        response.json({ status: "ok" });

    }
    catch (error) {
        console.log(error);
        response.json(error);
    }


    /* const product = request.body;
    const name = product.name;
    const price = product.price;
    const stock = product.stock;
    const description = product.description;
    const status = product.status; */




    /*   /* /* Se convierten en variable   de una función utilizando la destructuración*/
})

app.put("/update-product/:id", async (request, response) => {
    /* let {
        id
    } = request.params; */


    const id = request.body.id;
    const { name, price, stock, description, status } = request.body;
    /*  const product = request.body;
 
     const name = product.name;
     const price = product.price;
     const stock = product.stock;
     const description = product.description;
     const status = product.status; */

    await connection.execute(`UPDATE product SET name='${name}', price='${price}', stock='${stock}', description='${description}', status='${status}' WHERE id='${id}'`);

    console.log(name);
    response.json(product);
})





app.delete("/delete-product/:id", async (request, response) => {
    /*  let {
         id
     } = request.params; */
    const id = request.body.id;
    const product = request.body;
    /* const id = product.id; */
    /*   const name = product.name;
      const price = product.price;
      const stock = product.stock;
      const description = product.description;
      const status = product.status; */

    await connection.execute(`DELETE FROM  products WHERE id= '${id}'`);
    response.send("Producto eliminado");
    console.log(product.name);
    response.json(product);

})

app.listen(app.get('port'), async () => {
    connection = await mysql.createConnection({
        host: 'sql10.freesqldatabase.com',
        user: 'sql10446789',
        password: 'mXberpq98r',
        database: 'sql10446789',
        port: 3306,
        Promise: bluebird
    });
    console.log("Server running on port: " + app.get("port"));

});