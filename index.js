const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bjmxp4e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try {
        await client.connect();
        const productCollection = client.db('product_bazar').collection("products")

        app.get("/products", async (res, req) => {

        })
        app.post("/products", async (res, req) => {
            const product = req.body;
            if (!product?.name || !product?.price) {
                return res.send({ success: false, error: "Please provide all information" })
            }
            const result = await productCollection.insertOne(product)
            res.send({ success: true, message: `${product?.name} product added successfully` })
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