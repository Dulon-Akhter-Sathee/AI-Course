const boardElement = document.getElementById("board"); //container
const statusText = document.getElementById("status"); //messages

let board = Array(9).fill(""); // Empty 3x3 board
let currentPlayer = "X"; // You start
let gameActive = true;  // Game state

const winPatterns = [
  [0, 1, 2], [3, 4, 5],[6, 7, 8], // Rows
  [0, 3, 6],[1, 4, 7],[2, 5, 8],  // Columns
  [0, 4, 8],[2, 4, 6], // Diagonals
];

function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, i) => {
    const cellEl = document.createElement("div");
    cellEl.classList.add("cell");
    cellEl.textContent = cell;
    cellEl.addEventListener("click", () => handleMove(i));
    boardElement.appendChild(cellEl);
  });
}

function handleMove(index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;  // Put "X" in the cell
  renderBoard();

  if (checkWinner(board, currentPlayer)) {
    statusText.textContent = `${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a tie!";
    gameActive = false;
    return;
  } 
  currentPlayer = "O";
  statusText.textContent = "AI is thinking...";
  setTimeout(() => {
    let bestMove = getBestMove(board); // best possible move for the AI
    board[bestMove] = currentPlayer;
    renderBoard();

    if (checkWinner(board, currentPlayer)) {
      statusText.textContent = `${currentPlayer} (AI) wins!`;
      gameActive = false;
      return;
    }

    if (board.every(cell => cell !== "")) {
      statusText.textContent = "It's a tie!";
      gameActive = false;
      return;
    }

    currentPlayer = "X";
    statusText.textContent = "Your turn! (X)";
  }, 500);
}

function checkWinner(b, player) {
  return winPatterns.some(pattern =>
    pattern.every(i => b[i] === player)
  );
}

function getBestMove(b) {
  let bestScore = -Infinity;
  let move;
  b.forEach((cell, i) => {
    if (cell === "") {
      b[i] = "O";
      let score = minimax(b, 0, false);
      b[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });
  return move;
}

function minimax(b, depth, isMaximizing) {
  if (checkWinner(b, "O")) return 10 - depth;
  if (checkWinner(b, "X")) return depth - 10;
  if (b.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    b.forEach((cell, i) => {
      if (cell === "") {
        b[i] = "O";
        best = Math.max(best, minimax(b, depth + 1, false));
        b[i] = "";
      }
    });
    return best;
  } else {
    let best = Infinity;
    b.forEach((cell, i) => {
      if (cell === "") {
        b[i] = "X";
        best = Math.min(best, minimax(b, depth + 1, true));
        b[i] = "";
      }
    });
    return best;
  }
}

function restartGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Your turn! (X)";
  renderBoard();
}

renderBoard();
