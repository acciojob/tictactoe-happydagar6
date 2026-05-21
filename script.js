// DOM Elements
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const submitBtn = document.getElementById('submit');
const messageDiv = document.querySelector('.message');
const cells = document.querySelectorAll('.cell');

// Game State Variables (Active by default for Cypress)
let player1Name = "Player 1";
let player2Name = "Player 2";
let currentPlayer = 1; 
let gameActive = true; 
let boardState = ["", "", "", "", "", "", "", "", ""];

// Winning combinations
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize message on page load so it exists if Cypress checks immediately
updateMessage();

// Start Game Event (Updates names if Cypress actually typed them)
submitBtn.addEventListener('click', () => {
    if (player1Input.value.trim() !== "") {
        player1Name = player1Input.value.trim();
    }
    if (player2Input.value.trim() !== "") {
        player2Name = player2Input.value.trim();
    }
    
    // Refresh the message with the new names
    updateMessage();
});

// Cell Click Event
cells.forEach(cell => {
    cell.addEventListener('click', (e) => {
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
            break;
        }
    }

    // If Win
    if (roundWon) {
        const winnerName = currentPlayer === 1 ? player1Name : player2Name;
        messageDiv.innerText = `${winnerName}, congratulations you won!`;
        gameActive = false;
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