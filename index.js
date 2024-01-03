const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.an9sbnh.mongodb.net/?retryWrites=true&w=majority`;

  console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const cocacolaCollection = client.db('cocacolaDB').collection('cocacola');

    app.get('/cocacola', async (req, res) => {
      const cursor = cocacolaCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/cocacola/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cocacolaCollection.findOne(query);
      res.send(result);
    })


    app.post('/cocacola', async (req, res) => {
      const newCocacola = req.body;
      console.log(newCocacola);
      const result = await cocacolaCollection.insertOne(newCocacola);
      res.send(result);
    })


    app.put('/cocacola/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedCocacola = req.body;
      const cocacola = {
        $set: {
          name: updatedCocacola.name,
          quantity: updatedCocacola.quantity,
          supplier: updatedCocacola.supplier,
          taste: updatedCocacola.taste,
          category: updatedCocacola.category,
          details: updatedCocacola.details,
          photo: updatedCocacola.photo
        }
      }
      const result = await cocacolaCollection.updateOne(filter, cocacola, options);
      res.send(result);
    })

    app.delete('/cocacola/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cocacolaCollection.deleteOne(query);
      res.send(result);
    })

    
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Coffee making server is running')
})

app.listen(port, () => {
  console.log(`Coffee server is running on port: ${port}`);
})