const { MongoClient } = require("mongodb")
const express = require("express")
const cors = require("cors")

const PORT = 3001

const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)

const database = client.db("gameDatabase")

const playerCollection = database.collection("players")
const historyCollection = database.collection("history")

const app = express()
app.use(cors())
app.use(express.json())

// Route GET pour récupérer tous les joueurs
app.get("/players", async (req, res) => {
  try {
    const result = await playerCollection.find().toArray()
    res.status(200).json(result)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des joueurs", error })
  }
})

// Route GET pour récupérer le leaderboard
app.get("/leaderboard", async (req, res) => {
  try {
    const result = await playerCollection
      .find({})
      .sort({ score: -1 })
      .limit(3)
      .toArray()
    res.status(200).json(result)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du leaderboard", error })
  }
})

// Route POST pour ajouter un joueur
app.post("/players", async (req, res) => {
  const player = req.body
  try {
    await playerCollection.insertOne(player)
    res.status(201).json(player)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout du joueur", error })
  }
})

// Route PATCH pour mettre à jour le score d'un joueur
app.patch("/players", async (req, res) => {
  const { name } = req.body

  try {
    const result = await playerCollection.updateOne(
      { name },
      { $inc: { score: 1 } }
    )

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Joueur non trouvé" })
    }

    res.status(200).json({ message: "Score mis à jour" })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du score", error })
  }
})

// Route GET pour récupérer l'historique d'un joueur
app.get("/history", async (req, res) => {
  const name = req.query.name
  try {
    const result = await historyCollection.find({ name }).toArray()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'historique",
      error,
    })
  }
})

// Route POST pour ajouter un document à l'historique
app.post("/history", async (req, res) => {
  const newDocument = req.body
  try {
    await historyCollection.insertOne(newDocument)
    res.status(201).json(newDocument)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout à l'historique", error })
  }
})

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}: http://localhost:${PORT}/`)
})
