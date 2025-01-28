var currentPlayer
var currentTurn = "X"
var winning = false
const leaderBoardDiv = document.getElementById("leaderBoardDiv")
let historyDiv = document.getElementById("historyDiv")
const gameBoardDiv = document.getElementById("gameBoardDiv")
const startButton = document.getElementById("startButton")
const showHistoryButton = document.getElementById("showHistoryButton")
const buttons = document.querySelectorAll("#gameBoard .button")
const turnDisplay = document.getElementById("turn")
const resetButton = document.getElementById("resetButton")
const userNameDiv = document.getElementById("userNameDiv")
let gameBoard = Array(9).fill(null)

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
  userNameDiv.innerHTML += `<p>Bienvenue ${currentPlayer.name} | Score : ${currentPlayer.score}</p>`
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
  let historyCount = 1
  history.forEach((game) => {
    history_html += `
      <div class="history-card">
          <h3>Partie #${historyCount} - ${
      game.victory ? "Victoire" : "Défaite"
    }</h3>
          <h3>Plateau final : </h3>
          <p>${game.board.ligne1}</p>
          <p>------------</p>
          <p>${game.board.ligne2}</p>
          <p>------------</p>
          <p>${game.board.ligne3}</p>
      </div>
    `
    historyCount++
  })

  return history_html
}

showHistoryButton.addEventListener("click", async () => {
  const history = await getPlayerHistory(currentPlayer.name)
  // console.log(createHistoryCard(history))
  historyDiv.innerHTML += createHistoryCard(history)
})

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (!gameBoard[index]) {
      gameBoard[index] = currentTurn
      button.textContent = currentTurn
      button.disabled = true
      if (checkWinner()) {
        turnDisplay.textContent = `Le joueur ${currentTurnText} a gagné!`
        winning = currentTurnText === currentPlayer.name ? true : false
        disableAllButtons()
        saveGameResult(winning)
      } else {
        currentTurn = currentTurn === "X" ? "O" : "X"
        currentTurnText = currentTurn === "X" ? currentPlayer.name : "ROBOT"
        turnDisplay.textContent = `Tour de ${currentTurnText}`
      }
    }
  })
})

async function saveGameResult(victory) {
  const boardState = {
    ligne1: `${gameBoard[0] || ""}|${gameBoard[1] || ""}|${gameBoard[2] || ""}`,
    ligne2: `${gameBoard[3] || ""}|${gameBoard[4] || ""}|${gameBoard[5] || ""}`,
    ligne3: `${gameBoard[6] || ""}|${gameBoard[7] || ""}|${gameBoard[8] || ""}`,
  }

  const gameData = {
    name: currentPlayer.name,
    board: boardState,
    victory: victory,
  }
  console.log(gameData)

  addHistoryDB(gameData)
  if (victory) updatePlayerScore(currentPlayer.name)
}

async function addHistoryDB(gameData) {
  await fetch(HISTORY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gameData),
  })
}

async function updatePlayerScore(playerName) {
  try {
    const response = await fetch(`${PLAYER_URL}?name=${playerName}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Erreur lors de la requête PATCH:", error)
  }
}

function disableAllButtons() {
  buttons.forEach((button) => (button.disabled = true))
}
function checkWinner() {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  return winningCombos.some((combo) =>
    combo.every((index) => gameBoard[index] === currentTurn)
  )
}

resetButton.addEventListener("click", () => {
  gameBoard = Array(9).fill(null)
  currentTurn = "X"
  winning = false
  currentTurnText = currentPlayer.name
  turnDisplay.textContent = `Tour de ${currentTurnText}`
  buttons.forEach((button) => {
    button.textContent = ""
    button.disabled = false
  })
})

fetchingLeaderBoard()
hidingGameBoardAndHistory()
