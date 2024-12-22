const boardSize = 4; // 4x4 board
const gameBoard = document.getElementById("game-board");

let board = [];
let touchStartX = 0;
let touchStartY = 0;

// Initialize the game
function initializeGame() {
  // Initialize a 4x4 board with empty values (0)
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  addRandomTile(); // Add the first random tile
  addRandomTile(); // Add the second random tile
  renderBoard(); // Render the updated board
}

// Add a random tile (2 or 4) to an empty spot
function addRandomTile() {
  const emptyTiles = [];

  // Find all empty tiles (value is 0)
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 0) emptyTiles.push({ x: i, y: j });
    }
  }

  // If there are empty spots, pick one randomly to place a tile (2 or 4)
  if (emptyTiles.length > 0) {
    const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[x][y] = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4
  }
}

// Render the board (display the tiles)
function renderBoard() {
  gameBoard.innerHTML = ""; // Clear the board before rendering

  // Loop through each row and column to create and place tiles
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const tile = document.createElement("div");
      tile.classList.add("tile"); // Add the base tile class

      // If the tile is empty (value 0), mark it as empty
      if (board[i][j] === 0) {
        tile.classList.add("empty");
      } else {
        // Otherwise, create an image for the tile and append it
        const img = document.createElement("img");
        img.src = `images/${board[i][j]}.svg`; // Use image based on tile value
        img.alt = board[i][j];
        tile.appendChild(img);
      }

      // Add the tile to the board
      gameBoard.appendChild(tile);
    }
  }
}

// Move tiles in the given direction
function moveBoard(direction) {
  const previousBoard = JSON.stringify(board); // Save the previous state of the board
  let moved = false;

  // Determine which direction to move and apply the corresponding slide function
  if (direction === "left") moved = slideLeft();
  if (direction === "right") moved = slideRight();
  if (direction === "up") moved = slideUp();
  if (direction === "down") moved = slideDown();

  // If the board moved, add a random tile and re-render
  if (moved) {
    addRandomTile();
    renderBoard();

    // If no moves are possible, show a "Game Over" message
    if (!canMove()) {
      setTimeout(() => alert("Game Over!"), 200);
    }
  } else if (previousBoard === JSON.stringify(board)) {
    // If no move was made, re-render the board to ensure it's up-to-date
    renderBoard();
  }
}

// Slide tiles to the left (handle merging and moving)
function slideLeft() {
  let moved = false;

  // Loop through each row
  for (let i = 0; i < boardSize; i++) {
    const row = board[i].filter((val) => val !== 0); // Remove zeros from the row

    // Merge tiles where applicable
    for (let j = 0; j < row.length - 1; j++) {
      if (row[j] === row[j + 1]) {
        row[j] *= 2; // Merge tiles by doubling the value
        row.splice(j + 1, 1); // Remove the merged tile
        moved = true; // Mark that the board has moved
      }
    }

    // Fill the row with zeros to restore its original length
    while (row.length < boardSize) row.push(0);

    // If the row changed, mark it as moved
    if (board[i].join("") !== row.join("")) moved = true;
    board[i] = row; // Update the board with the new row
  }

  return moved; // Return whether any tiles moved
}

// Slide tiles to the right (reverse the board, slide left, then reverse again)
function slideRight() {
  for (let i = 0; i < boardSize; i++) {
    board[i].reverse(); // Reverse the row
  }
  const moved = slideLeft(); // Slide left after reversing
  for (let i = 0; i < boardSize; i++) {
    board[i].reverse(); // Reverse the row back to its original order
  }
  return moved;
}

// Slide tiles upward (rotate board, slide left, then rotate back)
function slideUp() {
  board = rotateRight(board); // Rotate the board to treat columns as rows
  const moved = slideLeft(); // Perform a leftward slide
  board = rotateLeft(board); // Rotate the board back to its original orientation
  return moved;
}

// Slide tiles downward (rotate board, slide left, then rotate back)
function slideDown() {
  board = rotateLeft(board); // Rotate the board to treat columns as rows
  const moved = slideLeft(); // Perform a leftward slide
  board = rotateRight(board); // Rotate the board back to its original orientation
  return moved;
}

// Rotate the board 90 degrees to the left (transpose and reverse)
function rotateLeft(matrix) {
  return matrix[0].map((_, colIndex) =>
    matrix.map((row) => row[colIndex]).reverse()
  );
}

// Rotate the board 90 degrees to the right (rotate three times left)
function rotateRight(matrix) {
  return rotateLeft(rotateLeft(rotateLeft(matrix)));
}

// Check if any move is possible (empty spaces or mergeable tiles)
function canMove() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 0) return true; // Empty space exists
      if (j < boardSize - 1 && board[i][j] === board[i][j + 1]) return true; // Horizontal merge possible
      if (i < boardSize - 1 && board[i][j] === board[i + 1][j]) return true; // Vertical merge possible
    }
  }
  return false; // No moves possible
}

// Restart the game when the restart button is clicked
document
  .getElementById("restart-button")
  .addEventListener("click", initializeGame);

// Listen for keyboard events to move tiles using arrow keys
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      moveBoard("left");
      break;
    case "ArrowRight":
      moveBoard("right");
      break;
    case "ArrowUp":
      moveBoard("up");
      break;
    case "ArrowDown":
      moveBoard("down");
      break;
  }
});

// Listen for touch events to move tiles using swipes
gameBoard.addEventListener("touchstart", handleTouchStart, false);
gameBoard.addEventListener("touchmove", handleTouchMove, false);

// Handle the initial touch start (for swipe detection)
function handleTouchStart(e) {
  const touchStart = e.touches[0];
  touchStartX = touchStart.clientX; // Save the starting X coordinate
  touchStartY = touchStart.clientY; // Save the starting Y coordinate
}

// Handle the touch move (determine swipe direction)
function handleTouchMove(e) {
  if (!touchStartX || !touchStartY) return; // Return if no start position is set

  const touchEnd = e.touches[0];
  const diffX = touchEnd.clientX - touchStartX; // Calculate horizontal swipe distance
  const diffY = touchEnd.clientY - touchStartY; // Calculate vertical swipe distance

  // Determine the swipe direction based on which distance is greater
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) moveBoard("right"); // Swipe right
    else moveBoard("left"); // Swipe left
  } else {
    if (diffY > 0) moveBoard("down"); // Swipe down
    else moveBoard("up"); // Swipe up
  }

  // Reset touch start position after move
  touchStartX = 0;
  touchStartY = 0;
}

// Initialize the game on page load
initializeGame();
