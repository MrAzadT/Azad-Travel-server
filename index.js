const express = require('express')
const { MongoClient } = require('mongodb')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 4000

require('dotenv').config()
const ObjectId = require('mongodb').ObjectId

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ikemc.mongodb.net/azadTravel?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function run() {
  try {
    await client.connect()
    const database = client.db('azadTravel')
    const dataCollection = database.collection('myData')
    const userCollection = database.collection('users')
    const orderCollection = database.collection('orders')

    // get data
    app.get('/myData', async (req, res) => {
      const cursor = dataCollection.find({})
      const data = await cursor.toArray()
      res.send(data)
    })

    // get single data
    app.get('/singleData/:id', async (req, res) => {
      const { id } = req.params

      console.log(id)

      try {
        const single = await dataCollection.findOne({ _id: ObjectId(id) })
        res.status(200).json(single)
      } catch (error) {
        res.status(404).json({ message: error.message })
      }
    })

    // Posting Orders
    app.post('/orders', async (req, res) => {
      const data = req.body

      try {
        const result = await orderCollection.insertOne(data)
        res.status(200).json(result)
      } catch (error) {
        res.status(404).json({ message: error.message })
      }
    })

    // Getting Orders
    app.get('/orders', async (req, res) => {
      try {
        const result = orderCollection.find({})
        const data = await result.toArray()
        res.status(200).json(data)
      } catch (error) {
        res.status(404).json({ message: error.message })
      }
    })

    // Delete Orders
    app.get('/orderDelete/:id', async (req, res) => {
      const { id } = req.params
      try {
        const result = orderCollection.deleteOne({ _id: ObjectId(id) })
        res.status(200).json({ message: 'Deleted successfully' })
      } catch (error) {
        res.status(404).json({ message: error.message })
      }
    })

    // Getting Orders by email
    app.get('/myOrders/:email', async (req, res) => {
      const { email } = req.params
      try {
        const result = orderCollection.find({ email: email })
        const data = await result.toArray()
        res.status(200).json(data)
      } catch (error) {
        res.status(404).json({ message: error.message })
      }
    })
  } finally {
    // await client.close()
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
