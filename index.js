const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
require('dotenv').config();

// middleware - all api
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');

app.get('/', (req, res) => {
    res.send('Hello World!')
});

const uri = process.env.MONGO_DB_URI;

// Create mongodb
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

async function run() {
    try {
        await client.connect();

        // create db and dbcollections
        const db = client.db("hire_loop_db");
        const jobCollection = db.collection("jobs");

        // recruiter
        // add a job 
        app.post('/api/jobs', async (req, res) => {
            const job = req.body;
            const result = await jobCollection.insertOne(job);
            res.send(result);
        })

        // job get - showing job 
        app.get('/api/jobs', async (req, res) => {
            const query = {};
            if (req.query.companyId) {
                query.companyId = req.query.companyId;
            }
            if (req.query.status) {
                query.status = req.query.status;
            }
            const cursor = jobCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged you deployment, You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});