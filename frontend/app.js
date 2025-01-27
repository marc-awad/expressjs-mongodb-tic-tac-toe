const leaderBoardDiv = document.getElementById("leaderBoardDiv")

const API_URL = "http://localhost:3001"
const PLAYER_URL = `${API_URL}/players`
const HISTORY_URL = `${API_URL}/history`
const LEADERBOARD_URL = `${API_URL}/leaderboard`

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

fetchingLeaderBoard()
