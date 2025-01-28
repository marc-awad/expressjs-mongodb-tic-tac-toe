var currentPlayer

const leaderBoardDiv = document.getElementById("leaderBoardDiv")
let historyDiv = document.getElementById("historyDiv")
const gameBoardDiv = document.getElementById("gameBoardDiv")
const startButton = document.getElementById("startButton")
const showHistoryButton = document.getElementById("showHistoryButton")

const API_URL = "http://localhost:3001"
const PLAYER_URL = `${API_URL}/players`
const HISTORY_URL = `${API_URL}/history`
const LEADERBOARD_URL = `${API_URL}/leaderboard`

function hidingGameBoardAndHistory() {
  gameBoardDiv.style.display = "none"
  historyDiv.style.display = "none"
}

function showingGameBoardAndHistory() {
  gameBoardDiv.style.display = "block"
  historyDiv.style.display = "block"
}

startButton.addEventListener("click", () => {
  const playerNameInput = document.getElementById("playerNameInput").value
  searchPlayerFromName(playerNameInput)
})

async function searchPlayerFromName(playerName) {
  let playerFound = false
  const result = await fetch(PLAYER_URL)
  const players = await result.json()
  players.forEach((player) => {
    if (player["name"] == playerName) {
      currentPlayer = player
      playerFound = true
      console.log("Joueur trouvé :", currentPlayer)
    }
  })
  if (!playerFound) {
    let newPlayer = { name: playerName, score: 0 }
    await fetch(PLAYER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlayer),
    })
    currentPlayer = newPlayer
    console.log("Joueur créé :", newPlayer)
  }
  showingGameBoardAndHistory()
}

async function getPlayerHistory(playerName) {
  const result = await fetch(`${HISTORY_URL}?name=${playerName}`)
  const gamesHistory = await result.json()
  return gamesHistory
}

function createPlayerBoard(playerNumber, playerName, playerScore) {
  return `<p>${playerNumber}. ${playerName} - Score : ${playerScore}</p>`
}

async function fetchingLeaderBoard() {
  const result = await fetch(LEADERBOARD_URL)
  const data = await result.json()
  let playersCount = 1
  data.forEach((player) => {
    leaderBoardDiv.innerHTML += createPlayerBoard(
      playersCount,
      player["name"],
      player["score"]
    )
    playersCount++
  })
}

function createHistoryCard(history) {
  let history_html = ""

  history.forEach((game) => {
    history_html += `
      <div class="history-card">
        <h3>Joueur : ${game.name}</h3>
        <div class="board">
          <p>${game.board.ligne1}</p>
          <p>${game.board.ligne2}</p>
          <p>${game.board.ligne3}</p>
        </div>
        <p>Victoire : ${game.victory ? "Oui" : "Non"}</p>
      </div>
    `
  })

  return history_html
}

showHistoryButton.addEventListener("click", async () => {
  const history = await getPlayerHistory(currentPlayer.name)
  // console.log(createHistoryCard(history))
  historyDiv.innerHTML += createHistoryCard(history)
})

fetchingLeaderBoard()
hidingGameBoardAndHistory()
