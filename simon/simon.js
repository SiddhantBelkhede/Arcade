// Define colors for the buttons
const buttonColors = ["red", "blue", "green", "yellow"];

let gamePattern = []; // Pattern of colors generated by the game
let userClickedPattern = []; // Pattern of colors clicked by the user

let started = false; // Flag to check if the game has started
let level = 0; // Current level of the game

// Start the game when a key is pressed or on first touch
document.addEventListener("keydown", startGame); // Keydown event listener
document.addEventListener("touchstart", startGame, { passive: true }); // Touchstart event listener for mobile

// Function to start the game
function startGame() {
  if (!started) { // Check if the game hasn't started yet
    document.getElementById("level-title").textContent = `Level ${level}`; // Display the current level
    nextSequence(); // Start the first sequence
    started = true; // Set the flag to true indicating the game has started
  }
}

// Handle button clicks and touch events
document.querySelectorAll(".btn").forEach((button) => {
  // Add event listeners for both clicks and touch events
  button.addEventListener("click", handleUserClick);
  button.addEventListener("touchstart", handleUserClick, { passive: true });
});

// Function to handle user's click or touch on a button
function handleUserClick(event) {
  const userChosenColor = event.target.id; // Get the color of the clicked button
  userClickedPattern.push(userChosenColor); // Add the clicked color to the user's pattern

  playSound(userChosenColor); // Play sound for the clicked button
  animatePress(userChosenColor); // Animate the button press

  console.log(`Button pressed: ${userChosenColor}`); // Log button pressed for clarity
  checkAnswer(userClickedPattern.length - 1); // Check if the user's choice is correct
}

// Function to check the user's answer
function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) { 
    // If the user's answer matches the game pattern
    console.log(
      `Correct button at level ${level}: ${userClickedPattern[currentLevel]}`
    ); // Log the correct input

    // If the user has completed the full sequence correctly
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(nextSequence, 1000); // Go to the next sequence after a short delay
    }
  } else {
    // If the user's answer is wrong
    console.log(`Wrong button pressed: ${userClickedPattern[currentLevel]}`); // Log the wrong input
    playSound("wrong"); // Play the "wrong" sound
    document.body.classList.add("game-over"); // Add "game-over" class to animate the screen
    document.getElementById("level-title").textContent =
      "Game Over, Press Any Key to Restart"; // Display the game over message

    setTimeout(() => {
      document.body.classList.remove("game-over"); // Remove the "game-over" animation after 200ms
    }, 200);

    startOver(); // Restart the game
  }
}

// Function to generate the next sequence
function nextSequence() {
  userClickedPattern = []; // Reset the user's clicked pattern
  level++; // Increase the level
  document.getElementById("level-title").textContent = `Level ${level}`; // Update the level display

  const randomNumber = Math.floor(Math.random() * 4); // Generate a random number between 0 and 3
  const randomChosenColor = buttonColors[randomNumber]; // Get the corresponding color
  gamePattern.push(randomChosenColor); // Add the chosen color to the game pattern

  console.log(`Next sequence color: ${randomChosenColor}`); // Log the next sequence color

  // Flash animation for the chosen button
  const chosenButton = document.getElementById(randomChosenColor);
  chosenButton.classList.add("flash"); // Add the flash class to the button
  setTimeout(() => chosenButton.classList.remove("flash"), 500); // Remove the flash effect after 500ms

  playSound(randomChosenColor); // Play the sound for the chosen button
  animatePress(randomChosenColor); // Animate the press of the button
}

// Function to animate button press
function animatePress(currentColor) {
  const button = document.getElementById(currentColor);
  button.classList.add("pressed"); // Add the "pressed" class to simulate a press
  setTimeout(() => {
    button.classList.remove("pressed"); // Remove the "pressed" class after 100ms
  }, 100);
}

// Function to play sound for a specific button
function playSound(name) {
  const audio = new Audio(`sounds/${name}.mp3`); // Create a new audio element for the sound
  audio.play(); // Play the audio
}

// Function to reset the game state after a game over
function startOver() {
  console.log("Game restarting..."); // Log the restart
  level = 0; // Reset the level to 0
  gamePattern = []; // Clear the game pattern
  started = false; // Reset the started flag to false
}