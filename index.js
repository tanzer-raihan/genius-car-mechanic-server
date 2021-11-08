const express = require('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const app = express();
const port =process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0s1of.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("GeniusMechanic");
        const serviceCollection = database.collection("services");

        //get api
        app.get('/services', async (req, res) => {

            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            console.log(services.length);
            res.send(services);
        })
        //get a specific one 
        app.get('/services/:id',async(req,res)=>{
            const  id=req.params.id;
            
            const query=ObjectId(id);
            const result= await serviceCollection.findOne(query);
            res.send(result)
        })
        //post api
        app.post('/services', async (req, res) => {
            const service = req.body;

            const result = await serviceCollection.insertOne(service);
            res.send(result);
            console.log(result);

        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('welcome to genius car mechanics');


})
app.listen(port, (req, res) => {
    console.log('listening to port', port);
})