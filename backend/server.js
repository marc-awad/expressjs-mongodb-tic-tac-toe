const { MongoClient } = require("mongodb")
const express = require("express")
const PORT = 3001

const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)

const database = client.db("gameDatabase")

const playerCollection = database.collection("players")
const historyCollection = database.collection("history")

const app = express()
app.use(express.json())

// Route GET pour récupérer tous les joueurs
app.get("/players", async (req, res) => {
  const result = await playerCollection.find().toArray()
  res.status(200).json(result)
})

// Route POST pour ajouter un joueur
app.post("/players", async (req, res) => {
  const player = req.body
  await playerCollection.insertOne(player)
  res.status(200).json(player)
})

// Route DELETE pour supprimer un joueur par son prénom
app.delete("/players", async (req, res) => {
  const playerName = req.body.prenom // Assure-toi que le nom est passé dans `prenom`
  const result = await playerCollection.deleteOne({ prenom: playerName })

  if (result.deletedCount === 0) {
    return res
      .status(404)
      .json({ message: "Aucun joueur trouvé avec ce prénom" })
  }

  res.status(200).json({ message: `Joueur ${playerName} supprimé avec succès` })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}: http://localhost:${PORT}/`)
})