const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hjclg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)

async function run() {
    try {
        await client.connect();
        // console.log("connected");
        const database = client.db('camera_kingdom');
        const camerasCollection = database.collection('explores');

        app.post('/explores', async (req, res) => {
            const cameras = req.body;
            console.log("Hit", cameras);
            const result = await camerasCollection.insertOne(cameras);
            console.log(result);
            res.json(result);
        })

        app.get('/explores', async (req, res) => {
            const cursor = camerasCollection.find({});
            const cameras = await cursor.toArray();
            res.send(cameras)
        })

        app.get('/explores/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const explores = await camerasCollection.findOne(query);
            res.json(explores);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})