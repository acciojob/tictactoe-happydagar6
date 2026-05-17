//your JS code here. If required.
// DOM Elements
const setupSection = document.getElementById('setup-section');
const gameSection = document.getElementById('game-section');
const submitBtn = document.getElementById('submit');
const player1Input = document.getElementById('player-1');
const player2Input = document.getElementById('player-2');
const messageDiv = document.querySelector('.message');
const cells = document.querySelectorAll('.cell');

// Game State Variables
let player1Name = '';
let player2Name = '';
let currentPlayer = 1; // 1 for Player 1 (x), 2 for Player 2 (o)
let gameActive = false;
let boardState = ["", "", "", "", "", "", "", "", ""];

// Winning Combinations (using 0-based indices corresponding to cell IDs 1-9)
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Start Game Event
submitBtn.addEventListener('click', () => {
    player1Name = player1Input.value.trim();
    player2Name = player2Input.value.trim();

    if (player1Name === '' || player2Name === '') {
        alert("Please enter names for both players.");
        return;
    }

    // Hide setup, show game board
    setupSection.style.display = 'none';
    gameSection.style.display = 'flex';
    
    gameActive = true;
    updateMessage();
});

// Handle Cell Clicks
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const cellIndex = parseInt(cell.id) - 1; // Convert id (1-9) to array index (0-8)

        // Prevent action if cell is already clicked or game is over
        if (boardState[cellIndex] !== "" || !gameActive) {
            return;
        }

        // Update board and UI
        if (currentPlayer === 1) {
            boardState[cellIndex] = "x";
            cell.textContent = "x";
        } else {
            boardState[cellIndex] = "o";
            cell.textContent = "o";
        }

        checkWinOrDraw();
    });
});

// Update the turn message
function updateMessage() {
    if (currentPlayer === 1) {
        messageDiv.textContent = `${player1Name}, you're up`;
    } else {
        messageDiv.textContent = `${player2Name}, you're up`;
    }
}

// Check for Win or Draw
function checkWinOrDraw() {
    let roundWon = false;
    let winningCells = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            winningCells = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        const winnerName = currentPlayer === 1 ? player1Name : player2Name;
        messageDiv.textContent = `${winnerName}, congratulations you won!`;
        
        // Highlight winning cells
        winningCells.forEach(index => {
            document.getElementById((index + 1).toString()).classList.add('winner');
        });
        return;
    }

    // Check for Draw
    if (!boardState.includes("")) {
        gameActive = false;
        messageDiv.textContent = "It's a draw!";
        return;
    }

    // Switch Turns
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateMessage();
}