# Express.js TodoList

A simple tic tac toe project using **Express.js** and **MongoDB** for data management.

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- **Node.js**: [Download here](https://nodejs.org/)
- **npm**: Comes with the Node.js installation

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/marc-awad/expressjs-mongodb-tic-tac-toe
   cd expressjs-mongodb-tic-tac-toe
   ```

2. Install the necessary dependencies:

   ```bash
   npm install express
   ```

3. Install **MongoDB**:
   ```bash
   npm install mongodb
   ```

## Running the Project

1. Start the Express.js server (should work on its own):

   ```bash
   node server.js
   ```

2. Listen on the corresponding port:

   ```bash
      localhost:3000
   ```

### **Instructions:**

1. **Creation and Management of the MongoDB Database**
    - Create a database `tic_tac_toe_db` with two collections:
        - `players`: to store player names and their scores.
        - `history`: to record all played games with final boards and winners.

2. **Game Launch**
    - Upon launching the game, display a **leaderboard** of the **top 3 players**, ranked by descending score.

3. **Player Input**
    - Ask the player to enter their name.
    - If the player is new, add them to the database with an initial score of 0.
    - Otherwise, retrieve their existing score and display it.

4. **Displaying Game History**
    - After entering their name, the player should have the option to view the history of all their past games (wins and losses) by displaying the final boards.

5. **Game Progression**
    - The game should display an empty 3x3 board.
    - The player starts by choosing the square where they want to play.
    - The computer then makes a random move.
    - The game continues until there is a winner or a draw.

6. **Win and Loss Conditions**
    - A player wins if they align three identical symbols horizontally, vertically, or diagonally.
    - With each win by the player, their score should be incremented in the database.
    - With each win (by player or computer), the game should be recorded in the `history` collection with:
        - The player's name,
        - The final board,
        - The winner.

7. **End of the Game**
    - If the player loses to the computer, the game ends and the final score is displayed.
    - The player can choose to play again or exit the game.
