// Detecting Button Press
var buttons = document.querySelectorAll(".drum"); // Select all drum buttons
var length = buttons.length; // Get the total number of buttons

// Loop through each button and add an event listener for click events
for (var i = 0; i < length; i++) {
  buttons[i].addEventListener("click", function () {
    var buttonHTML = this.innerHTML; // Get the innerHTML (key) of the clicked button

    makeSound(buttonHTML); // Play the corresponding sound
    buttonAnimation(buttonHTML); // Add the animation effect
  });
}

// Detecting Key Press
document.addEventListener("keydown", function (event) {
  makeSound(event.key); // Play the corresponding sound based on the pressed key
  buttonAnimation(event.key); // Add the animation effect for the pressed key
});

// Caching audio files
var sounds = {
  w: new Audio("./sounds/tom-1.mp3"), // Audio for key 'w'
  a: new Audio("./sounds/tom-2.mp3"), // Audio for key 'a'
  s: new Audio("./sounds/tom-3.mp3"), // Audio for key 's'
  d: new Audio("./sounds/tom-4.mp3"), // Audio for key 'd'
  j: new Audio("./sounds/snare.mp3"), // Audio for key 'j'
  k: new Audio("./sounds/crash.mp3"), // Audio for key 'k'
  l: new Audio("./sounds/kick-bass.mp3") // Audio for key 'l'
};

// Plays sound according to the keys pressed (either by button click or key press)
function makeSound(key) {
  if (sounds[key]) { // Check if the key corresponds to a sound
    sounds[key].currentTime = 0; // Reset the audio to start from the beginning
    sounds[key].play(); // Play the sound
  } else {
    console.log(`Invalid key: ${key}`); // Log if an invalid key is pressed
  }
}

// Add Button Animation (animation for when a button is pressed)
function buttonAnimation(key) {
  var pressedButton = document.querySelector("." + key); // Select the button by its class (key)
  if (pressedButton) { // Check if the button exists
    pressedButton.classList.add("pressed"); // Add the 'pressed' class for animation
    setTimeout(function () {
      pressedButton.classList.remove("pressed"); // Remove the 'pressed' class after 100ms
    }, 100);
  }
}
