const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;

const bodyParser = require("body-parser");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ikemc.mongodb.net/azadTravel?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const ordersCollection = client.db("azadTravel").collection("users");
  const dataCollection = client.db("azadTravel").collection("myData");
  // perform actions on the collection object
  // client.close();

  // get data
  app.get("/myData", (req, res) => {
    dataCollection.find({}).toArray((err, results) => {
      res.send(results);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
