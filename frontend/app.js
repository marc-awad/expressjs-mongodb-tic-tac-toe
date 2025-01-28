//////////////////////////////////////
// Variable Initializations
//////////////////////////////////////

// Game state variables
var currentPlayer
var currentTurn = "X"
var winning = false
var isActiveHistory = false

// DOM element references
const parentHistoryDiv = document.getElementById("parentHistoryDiv")
const leaderBoardDiv = document.getElementById("leaderBoardDiv")
const gameBoardDiv = document.getElementById("gameBoardDiv")
const startButton = document.getElementById("startButton")
const showHistoryButton = document.getElementById("showHistoryButton")
const buttons = document.querySelectorAll("#gameBoard .button")
const turnDisplay = document.getElementById("turn")
const resetButton = document.getElementById("resetButton")
const userNameDiv = document.getElementById("userNameDiv")
let gameBoard = Array(9).fill(null)
let historyDiv = document.getElementById("historyDiv")

// API URLs
const API_URL = "http://localhost:3001"
const PLAYER_URL = `${API_URL}/players`
const HISTORY_URL = `${API_URL}/history`
const LEADERBOARD_URL = `${API_URL}/leaderboard`

//////////////////////////////////////
// Dynamic Element Creations
//////////////////////////////////////

// Creates and appends the score display
const scoreDisplay = document.createElement("p")
scoreDisplay.id = "scoreDisplay"
userNameDiv.appendChild(scoreDisplay)

// Creates and configures the clear history button
const clearHistoryButton = document.createElement("button")
clearHistoryButton.textContent = "Fermer l'historique"
clearHistoryButton.id = "clearHistoryButton"

// Creates and configures the reload history button
const reloadHistoryButton = document.createElement("button")
reloadHistoryButton.textContent = "Actualiser l'historique"
reloadHistoryButton.id = "reloadHistoryButton"

//////////////////////////////////////
// Utility Functions
//////////////////////////////////////

// Hides the game board and history sections
function hidingGameBoardAndHistory() {
  gameBoardDiv.style.display = "none"
  parentHistoryDiv.style.display = "none"
}

// Shows the game board and history sections
function showingGameBoardAndHistory() {
  gameBoardDiv.style.display = "block"
  parentHistoryDiv.style.display = "block"
}

// Updates the score display with the current player's name and score
function updateScoreDisplay() {
  if (currentPlayer) {
    scoreDisplay.textContent = `Bienvenue ${currentPlayer.name} | Score : ${currentPlayer.score}`
  }
}

// Creates a leaderboard entry
function createPlayerBoard(playerNumber, playerName, playerScore) {
  return `<p>${playerNumber}. ${playerName} - Score : ${playerScore}</p>`
}

// Creates a history card for each game
function createHistoryCard(history) {
  let history_html = ""
  let historyCount = 1
  let victoryOrDrawOrLoose = ""

  history.forEach((game) => {
    switch (game.gamestate) {
      case 1:
        victoryOrDrawOrLoose = "Victoire"
        break
      case 0:
        victoryOrDrawOrLoose = "Match Nul"
        break
      case -1:
        victoryOrDrawOrLoose = "Défaite"
        break
      default:
        victoryOrDrawOrLoose = "Résultat Inconnu"
    }
    history_html += `
      <div class="history-card">
          <h3>Partie #${historyCount} - ${victoryOrDrawOrLoose}</h3>
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
// Display player history
async function showHistory() {
  if (!isActiveHistory) {
    historyDiv.style.display = "block"
    const history = await getPlayerHistory(currentPlayer.name)
    historyDiv.innerHTML += createHistoryCard(history)
    historyDiv.appendChild(clearHistoryButton)
    historyDiv.appendChild(reloadHistoryButton)
    isActiveHistory = true
  }
}

// Clear history display
function clearHistory() {
  historyDiv.innerHTML = ""
  historyDiv.style.display = "none"
  isActiveHistory = false
}

// Save game result and update leaderboard
async function saveGameResult(gameState) {
  const boardState = {
    ligne1: `${gameBoard[0] || ""}|${gameBoard[1] || ""}|${gameBoard[2] || ""}`,
    ligne2: `${gameBoard[3] || ""}|${gameBoard[4] || ""}|${gameBoard[5] || ""}`,
    ligne3: `${gameBoard[6] || ""}|${gameBoard[7] || ""}|${gameBoard[8] || ""}`,
  }

  const gameData = {
    name: currentPlayer.name,
    board: boardState,
    gamestate: gameState,
  }

  addHistoryDB(gameData)
  if (gameState == 1) await updatePlayerScore(currentPlayer.name)

  await fetchingLeaderBoard()
  updateScoreDisplay()
}

// Disable all game buttons
function disableAllButtons() {
  buttons.forEach((button) => (button.disabled = true))
}

// Check for a winning combination
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

// Robot's turn to play
function robotPlay() {
  const emptyIndices = gameBoard
    .map((value, index) => (value === null ? index : null))
    .filter((index) => index !== null)

  if (emptyIndices.length === 0) return

  const randomIndex =
    emptyIndices[Math.floor(Math.random() * emptyIndices.length)]

  gameBoard[randomIndex] = currentTurn
  buttons[randomIndex].textContent = currentTurn
  buttons[randomIndex].disabled = true

  if (checkWinner()) {
    turnDisplay.textContent = `Le robot a gagné!`
    disableAllButtons()
    saveGameResult(-1)
  } else {
    currentTurn = currentTurn === "X" ? "O" : "X"
    currentTurnText = currentTurn === "X" ? currentPlayer.name : "ROBOT"
    turnDisplay.textContent = `Tour de ${currentTurnText}`
  }
}

//////////////////////////////////////
//Fetching Functions
//////////////////////////////////////
// Search for a player by name or create a new one if not found
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
  updateScoreDisplay()
}

// Fetch player history from the database
async function getPlayerHistory(playerName) {
  const result = await fetch(`${HISTORY_URL}?name=${playerName}`)
  const gamesHistory = await result.json()
  return gamesHistory
}

// Fetch and display the leaderboard
async function fetchingLeaderBoard() {
  const result = await fetch(LEADERBOARD_URL)
  const data = await result.json()
  let playersCount = 1
  leaderBoardDiv.innerHTML = ""
  leaderBoardDiv.innerHTML += "<h2>Leaderboard (Top3)</h2>"
  data.forEach((player) => {
    leaderBoardDiv.innerHTML += createPlayerBoard(
      playersCount,
      player["name"],
      player["score"]
    )
    playersCount++
  })
}

// Add a game result to the database
async function addHistoryDB(gameData) {
  await fetch(HISTORY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gameData),
  })
}

// Update the player's score in the database
async function updatePlayerScore(playerName) {
  try {
    await fetch(`${PLAYER_URL}?name=${playerName}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Erreur lors de la requête PATCH:", error)
  }
  currentPlayer.score += 1
}

//////////////////////////////////////
//Event listeners
//////////////////////////////////////
// Event listener for starting the game
startButton.addEventListener("click", () => {
  const playerNameInput = document.getElementById("playerNameInput").value
  searchPlayerFromName(playerNameInput)
})

// Event listener for showing history
showHistoryButton.addEventListener("click", async () => {
  await showHistory()
})

// Event listener for clearing history
clearHistoryButton.addEventListener("click", clearHistory)

// Event listener for reloading history
reloadHistoryButton.addEventListener("click", () => {
  clearHistory()
  showHistory()
})

// Add click event listeners to game board buttons
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
        saveGameResult(1)
      } else {
        if (gameBoard.every((cell) => cell !== null)) {
          turnDisplay.textContent = `Match nul!`
          disableAllButtons()
          saveGameResult(0)
        } else {
          currentTurn = currentTurn === "X" ? "O" : "X"
          turnDisplay.textContent = `Tour du robot...`
          setTimeout(robotPlay, 500)
        }
      }
    }
  })
})

// Add click event listener to the reset button
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

// Initialize the page on load
fetchingLeaderBoard()
hidingGameBoardAndHistory()
historyDiv.style.display = "none"
