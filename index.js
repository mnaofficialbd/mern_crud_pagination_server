const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.DB_PASS}@cluster0.bjmxp4e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(MongoClient);

const run = async () => {
    try {
        await client.connect();
        const productCollection = client.db('product_bazar').collection("products")

        // product add api
        app.post("/products", async (req, res) => {
            const product = req.body;
            if (!product.name || !product.price) {
                return res.send({ success: false, error: "Please provide all information" });
            }
            const result = await productCollection.insertOne(product)
            res.send({ success: true, message: `${product.name} product added successfully` })
        })

        // products get api
        app.get("/products", async (req, res) => {

            /* ====pagination part====== */
            const limit = Number(req.query.limit);
            const pageNumber = Number(req.query.pageNumber)
            /* ============================== */

            const cursor = productCollection.find();
            const products = await cursor.skip(limit * pageNumber).limit(limit).toArray();

            /* if(!products?.length){
                return res.send({success:false, error: "No product found"})
            } */
            res.send({ success: true, data: products })
        })

    } catch (error) {
        console.log(error);
    }
}
run();

app.get('/', (req, res) => {
    res.send('Product_Bazar Server is Run')
})

app.listen(port, () => {
    console.log("Server is Running", port);
})