const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;

// const bodyParser = require("body-parser");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ikemc.mongodb.net/azadTravel?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("azadTravel");
    const dataCollection = database.collection("myData");
    const userCollection = database.collection("users");

    // get data
    app.get("/myData", async (req, res) => {
      const cursor = dataCollection.find({});
      const data = await cursor.toArray();
      res.send(data);
    });

    // app.get("/singleData", (req, res) => {
    //   console.log(req.params.id);
    //   dataCollection
    //     .find({ _id: ObjectId(req.params.id) })
    //     .toArray((err, results) => {
    //       res.send(results[0]);
    //     });
    // });

    app.post("/userData", (req, res) => {
      console.log(req.body);
      // userCollection.insertOne(req.body).then((documents) => {
      //   res.send(documents.insertedId);
      // });
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
