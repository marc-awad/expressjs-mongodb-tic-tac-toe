# Express.js Tic Tac Toe

A simple Tic Tac Toe project using **Express.js** and **MongoDB** for data management.

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- **Node.js**: [Download here](https://nodejs.org/)
- **npm**: Comes with the Node.js installation
- **MongoDB**: [Download here](https://www.mongodb.com/try/download/community)

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/marc-awad/expressjs-mongodb-tic-tac-toe
   cd expressjs-mongodb-tic-tac-toe
   ```

2. Install the necessary dependencies for the package.json:

   ```bash
   npm i
   ```

## Initialize the MongoDB Database

### 1. Open the Mongo Shell:

Open your terminal or command prompt and start MongoDB's interactive shell by running:

```bash
mongosh
```

### 2. Create the Database:

Once in the Mongo shell, create a new database (if it doesn't exist already):

```bash
use tic_tac_toe_db
```

### 3. Create Collections:

To store the game data, create two collections: one for storing players and the other for storing the game history:

```bash
db.createCollection("players")
db.createCollection("history")
```

### 4. Connecting via MongoDB's Graphic Interface:

If you prefer using a graphical interface, connect to your local MongoDB instance using the following URL:

```bash
mongodb://localhost:27017
```

You can use MongoDB Compass or any other MongoDB GUI to visualize and manage your data.

## Running the Project

1. Start the Express.js server:

   ```bash
   npm start
   ```

2. The server will be available at:

   ```bash
   localhost:3001
   ```

3. Open the frontend to interact with the game:

   ```bash
   http://127.0.0.1:5500/frontend/index.html
   ```

## Instructions

### 1. **Database Creation and Management**

- Create a database `tic_tac_toe_db` with two collections:
  - `players`: To store player names and their scores.
  - `history`: To record all played games with final boards and winners.

### 2. **Game Launch**

- Upon launching the game, display a **leaderboard** of the **top 3 players**, ranked by descending score.

### 3. **Player Input**

- Ask the player to enter their name.
- If the player is new, add them to the database with an initial score of 0.
- If the player already exists, retrieve and display their current score.

### 4. **Displaying Game History**

- After entering their name, the player can view the history of their past games (wins and losses) with final boards displayed.

### 5. **Game Progression**

- Display an empty 3x3 game board.
- The player chooses a square to play.
- The computer makes a random move.
- The game continues until a winner or draw is determined.

### 6. **Win and Loss Conditions**

- A player wins if they align three identical symbols horizontally, vertically, or diagonally.
- Each win by the player increments their score in the database.
- Each win (by player or computer) is recorded in the `history` collection with:
  - The player's name,
  - The final board state,
  - The winner.

### 7. **End of the Game**

- If the player loses to the computer, the game ends, and the final score is displayed.
- The player can choose to play again or exit the game.
