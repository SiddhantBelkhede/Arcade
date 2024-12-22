// Generate a random dice roll between 1 and 6
function getRandomDiceNumber() {
  return Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
}

// Update dice images based on the random numbers
function updateDiceImage(diceId, diceNumber) {
  const diceImage = `images/dice${diceNumber}.png`; // Path to the dice image
  document.getElementById(diceId).setAttribute("src", diceImage); // Set the dice image source
}

// Main logic to determine the winner
function rollDiceAndDecideWinner() {
  // Generate two random dice rolls for Player 1 and Player 2
  const randomNumber1 = getRandomDiceNumber();
  const randomNumber2 = getRandomDiceNumber();

  // Update the dice images for both players based on the random rolls
  updateDiceImage("dice1", randomNumber1);
  updateDiceImage("dice2", randomNumber2);

  // Determine the winner and update the title on the page
  const gameTitle = document.getElementById("game-title");
  if (randomNumber1 > randomNumber2) {
    gameTitle.innerHTML = "🚩 Player 1 Wins!"; // Player 1 wins
  } else if (randomNumber2 > randomNumber1) {
    gameTitle.innerHTML = "Player 2 Wins! 🚩"; // Player 2 wins
  } else {
    gameTitle.innerHTML = "It's a Draw!"; // If both numbers are equal, it's a draw
  }
}

// Attach event listener to the "Roll Dice" button to trigger the roll and decide the winner
document
  .getElementById("roll-button")
  .addEventListener("click", rollDiceAndDecideWinner); // When the button is clicked, roll dice and determine the winner
