// Game board setup
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const board = [];
let rotatedShape;

// init board
for (let row = 0; row < BOARD_HEIGHT; row++) {
  board[row] = [];
  for (let col = 0; col < BOARD_WIDTH; col++) {
    board[row][col] = 0;
  }
}

// Tetrominoes
const tetrominoes = [
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#ffd800",
  },
  {
    shape: [
      [0, 2, 0],
      [2, 2, 2],
    ],
    color: "#7925DD",
  },
  {
    shape: [
      [0, 3, 3],
      [3, 3, 0],
    ],
    color: "orange",
  },
  {
    shape: [
      [4, 4, 0],
      [0, 4, 4],
    ],
    color: "red",
  },
  {
    shape: [
      [5, 0, 0],
      [5, 5, 5],
    ],
    color: "green",
  },
  {
    shape: [
      [0, 0, 6],
      [6, 6, 6],
    ],
    color: "#ff6400 ",
  },
  { shape: [[7, 7, 7, 7]], color: "#00b5ff" },
];

// Tetromino randomizer
function randomTetromino() {
  const index = Math.floor(Math.random() * tetrominoes.length);
  const tetromino = tetrominoes[index];
  return {
    shape: tetromino.shape,
    color: tetromino.color,
    row: 0,
    col: Math.floor(
      Math.random() * (BOARD_WIDTH - tetromino.shape[0].length + 1)
    ),
  };
}

// Current tetromino
let currentTetromino = randomTetromino();

// Draw tetromino
function drawTetromino() {
  const shape = currentTetromino.shape;
  const color = currentTetromino.color;
  const row = currentTetromino.row;
  const col = currentTetromino.col;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const block = document.createElement("div");
        block.classList.add("block");
        block.style.backgroundColor = color;
        block.style.top = (row + r) * 24 + "px";
        block.style.left = (col + c) * 24 + "px";
        block.setAttribute("id", `block-${row + r}-${col + c}`);
        document.getElementById("game_board").appendChild(block);
      }
    }
  }
}

// Erase tetromino from board
function eraseTetromino() {
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        let row = currentTetromino.row + i;
        let col = currentTetromino.col + j;
        let block = document.getElementById(`block-${row}-${col}`);

        if (block) {
          document.getElementById("game_board").removeChild(block);
        }
      }
    }
  }
}

// Check if tetromino can move in the specified direction
function canTetrominoMove(rowOffset, colOffset) {
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        let row = currentTetromino.row + i + rowOffset;
        let col = currentTetromino.col + j + colOffset;

        if (
          row >= BOARD_HEIGHT ||
          col < 0 ||
          col >= BOARD_WIDTH ||
          (row >= 0 && board[row][col] !== 0)
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

// Check if tetromino can move in the specified direction
function canTetrominoRotate() {
  for (let i = 0; i < rotatedShape.length; i++) {
    for (let j = 0; j < rotatedShape[i].length; j++) {
      if (rotatedShape[i][j] !== 0) {
        let row = currentTetromino.row + i;
        let col = currentTetromino.col + j;

        if (
          row >= BOARD_HEIGHT ||
          col < 0 ||
          col >= BOARD_WIDTH ||
          (row >= 0 && board[row][col] !== 0)
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

let score = 0;

function updateScore(rowsCleared) {
  const pointsPerRow = 100;
  const pointsEarned = rowsCleared * pointsPerRow;

  score += pointsEarned;

  document.getElementById("score").innerText = `Pontuação: ${score}`;
}

function checkGameOver() {
  for (let col = 0; col < BOARD_WIDTH; col++) {
    if (board[0][col] !== 0) {
      gameOver();
      return true;
    }
  }
  return false;
}

let promptDisplayed = false;

function gameOver() {
  if (promptDisplayed) {
    return; // Ignora a exibição de prompt se já foi exibido
  }

  promptDisplayed = true; // Marca que o prompt foi exibido

  const restart = confirm("Game Over! Pontuação final: " + score + "\nDeseja reiniciar o jogo?");
  if (restart) {
    location.reload(); // Recarrega a página para reiniciar o jogo
  } else {
    window.location.href = "index.html"; // Redireciona para a página inicial do simulador de jogos
  }
}

// Lock the tetromino in place
function lockTetromino() {
  // Add the tetromino to the board
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        let row = currentTetromino.row + i;
        let col = currentTetromino.col + j;
        board[row][col] = currentTetromino.color;
      }
    }
  }

  // Check if any rows need to be cleared
  let rowsCleared = clearRows();
  if (rowsCleared > 0) {
    updateScore(rowsCleared)
  }

  // Cria um novo tetromino
  // Current tetromino
  currentTetromino = randomTetromino();

  checkGameOver();
}

function clearRows() {
  let rowsCleared = 0;

  // Verifica de baixo para cima e apaga as linhas completamente preenchidas.
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    let rowFilled = true;

    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x] === 0) {
        rowFilled = false;
        break;
      }
    }

    if (rowFilled) {
      rowsCleared++;

      for (let yy = y; yy > 0; yy--) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[yy][x] = board[yy - 1][x];
        }
      }

      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[0][x] = 0;
      }
      document.getElementById("game_board").innerHTML = "";
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
          if (board[row][col]) {
            const block = document.createElement("div");
            block.classList.add("block");
            block.style.backgroundColor = board[row][col];
            block.style.top = row * 24 + "px";
            block.style.left = col * 24 + "px";
            block.setAttribute("id", `block-${row}-${col}`);
            document.getElementById("game_board").appendChild(block);
          }
        }
      }

      y++;
    }
  }

  return rowsCleared;
}

// Rotate the tetromino
function rotateTetromino() {
  rotatedShape = [];
  for (let i = 0; i < currentTetromino.shape[0].length; i++) {
    let row = [];
    for (let j = currentTetromino.shape.length - 1; j >= 0; j--) {
      row.push(currentTetromino.shape[j][i]);
    }
    rotatedShape.push(row);
  }

  // Check if the rotated tetromino can be placed
  if (canTetrominoRotate()) {
    eraseTetromino();
    currentTetromino.shape = rotatedShape;
    drawTetromino();
  }
}

// Move the tetromino
function moveTetromino(direction) {
  let row = currentTetromino.row;
  let col = currentTetromino.col;
  if (direction === "left") {
    if (canTetrominoMove(0, -1)) {
      eraseTetromino();
      col -= 1;
      currentTetromino.col = col;
      currentTetromino.row = row;
      drawTetromino();
    }
  } else if (direction === "right") {
    if (canTetrominoMove(0, 1)) {
      eraseTetromino();
      col += 1;

      currentTetromino.col = col;
      currentTetromino.row = row;
      drawTetromino();
    }
  } else {
    if (canTetrominoMove(1, 0)) {
      eraseTetromino();
      row++;
      currentTetromino.col = col;
      currentTetromino.row = row;
      drawTetromino();
    } else {
      lockTetromino();
    }
  }
}

drawTetromino();
setInterval(moveTetromino, 500);

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
  switch (event.keyCode) {
    case 37: // left arrow
      moveTetromino("left");
      break;
    case 39: // right arrow
      moveTetromino("right");
      break;
    case 40: // down arrow
      moveTetromino("down");
      break;
    case 38: // up arrow
      rotateTetromino();
      break;
    case 32: // up arrow
      dropTetromino();
      break;
    default:
      break;
  }
}

function dropTetromino() {
  let row = currentTetromino.row;
  let col = currentTetromino.col;

  while (canTetrominoMove(1, 0)) {
    eraseTetromino();
    row++;
    currentTetromino.col = col;
    currentTetromino.row = row;
    drawTetromino();
  }
  lockTetromino();
}
