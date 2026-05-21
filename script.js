// DOM Elements
const setupSection = document.getElementById('setup-section');
const gameSection = document.getElementById('game-section');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const submitBtn = document.getElementById('submit');
const messageDiv = document.querySelector('.message');
const cells = document.querySelectorAll('.cell');

// Game State Variables
let player1Name = "";
let player2Name = "";
let currentPlayer = 1; // 1 for Player 1 (x), 2 for Player 2 (o)
let gameActive = false;
let boardState = ["", "", "", "", "", "", "", "", ""];

// Winning combinations (indexes of the boardState array)
const winningConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal 1
    [2, 4, 6]  // Diagonal 2
];

// Start Game Event
submitBtn.addEventListener('click', () => {
    player1Name = player1Input.value.trim();
    player2Name = player2Input.value.trim();

    if (player1Name === "" || player2Name === "") {
        alert("Please enter names for both players.");
        return;
    }

    // Hide setup, show game board
    setupSection.style.display = "none";
    gameSection.style.display = "flex";
    gameActive = true;
    currentPlayer = 1;
    
    updateMessage();
});

// Cell Click Event
cells.forEach(cell => {
    cell.addEventListener('click', (e) => {
        // Get the cell ID and subtract 1 to match array index (0-8)
        const cellIndex = parseInt(e.target.id) - 1;

        // Check if cell is already played or game is over
        if (boardState[cellIndex] !== "" || !gameActive) {
            return;
        }

        // Update board and UI
        const mark = currentPlayer === 1 ? 'x' : 'o';
        boardState[cellIndex] = mark;
        e.target.innerText = mark;

        checkWin();
    });
});

// Function to update the turn message
function updateMessage() {
    if (!gameActive) return;
    const currentName = currentPlayer === 1 ? player1Name : player2Name;
    messageDiv.innerText = `${currentName}, you're up`;
}

// Function to validate if someone won or drew
function checkWin() {
    let roundWon = false;
    let winningCells = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = boardState[winCondition[0]];
        let b = boardState[winCondition[1]];
        let c = boardState[winCondition[2]];

        if (a === "" || b === "" || c === "") {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningCells = winCondition;
            break;
        }
    }

    // If Win
    if (roundWon) {
        const winnerName = currentPlayer === 1 ? player1Name : player2Name;
        messageDiv.innerText = `${winnerName} congratulations you won!`;
        gameActive = false;
        
        // Highlight the winning row/column/diagonal
        winningCells.forEach(index => {
            document.getElementById((index + 1).toString()).classList.add('win-highlight');
        });
        return;
    }

    // If Draw
    let roundDraw = !boardState.includes("");
    if (roundDraw) {
        messageDiv.innerText = `It's a draw!`;
        gameActive = false;
        return;
    }

    // Switch Turns
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateMessage();
}