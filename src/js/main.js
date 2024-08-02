// Background scrolling speed
let move_speed = 5;
  
// Gravity constant value
let gravity = 0.2;

const coins = ['eth', 'btc', 'sol', 'cat', 'chart', 'money'];

let score_value = 0;

const gold_score = 100;
const silver_score = 80;
const bronze_score = 50;
const diamond_score = 150;
  
// Getting reference to the bird element
let bird = document.querySelector('.bird');
  
// Getting bird element properties
let bird_props = bird.getBoundingClientRect();
let background =
    document.querySelector('.background')
            .getBoundingClientRect();
  
// Getting reference to the score element
let score_val =
    document.querySelector('.score_val');
let message =
    document.querySelector('.message');
let score_title =
    document.querySelector('.score_title');
  
// Setting initial game state to start
let game_state = 'Start';
let birdAnimationInterval; 

let bird_dy = 0;

document.querySelector('.menu-button').addEventListener('click', function() {
  const menu = document.querySelector('.menu');
  // Toggle the display property
  if (menu.style.display === 'none' || menu.style.display === '') {
      menu.style.display = 'block'; // Show the menu
  } else {
      menu.style.display = 'none'; // Hide the menu
  }
  const savedScore = localStorage.getItem('bestScore');
  const bestScoreContainer = document.querySelector('.best_score_val');
  bestScoreContainer.innerHTML = '';
  savedScore.toString().split('').forEach(digit => {
      const img = document.createElement('img');
      img.src = `src/img/Small Font ${digit}.png`; // Path to digit images
      img.alt = digit; // Set alt text for accessibility
      img.className = 'score_digit'; // Optional: add a class for styling
      bestScoreContainer.appendChild(img); // Append the image to the score container
  });
});
  
// Add an eventlistener for key presses
document.addEventListener('keydown', (e) => {
  
  // Start the game if enter key is pressed
  if (e.key == 'Enter' &&
      game_state != 'Play') {
    startGame();
  }
});


function updateScoreDisplay(score) {
  const scoreContainer = document.querySelector('.score_val');
  const menuScoreContainer = document.querySelector('.menu_score_val');
  scoreContainer.innerHTML = ''; // Clear existing score images
  menuScoreContainer.innerHTML = '';

  // Convert score to string to iterate over each digit
  score.toString().split('').forEach(digit => {
      const img = document.createElement('img');
      img.src = `src/img/Small Font ${digit}.png`; // Path to digit images
      img.alt = digit; // Set alt text for accessibility
      img.className = 'score_digit'; // Optional: add a class for styling
      scoreContainer.appendChild(img); // Append the image to the score container
      const img1 = document.createElement('img');
      img1.src = `src/img/Small Font ${digit}.png`; // Path to digit images
      img1.alt = digit; // Set alt text for accessibility
      img1.className = 'score_digit'; // Optional: add a class for styling
      menuScoreContainer.appendChild(img1);
  });

  // Set medal based on score
  let medalSrc;
  if (score >= diamond_score) {
      medalSrc = 'src/img/Diamond Medal.png'; // Diamond medal
  } else if (score >= gold_score) {
      medalSrc = 'src/img/Gold Medal.png'; // Gold medal
  } else if (score >= silver_score) {
      medalSrc = 'src/img/Silver Medal.png'; // Silver medal
  } else if (score >= bronze_score) {
      medalSrc = 'src/img/Bronze Medal.png'; // Bronze medal
  } else {
      medalSrc = ''; // No medal
  }

  // Update medal display
  document.getElementById('medal-image').src = medalSrc;
}

// Function to start the game
function startGame() {
    // Initialize game state and any other necessary setup 
    document.getElementById('bird').src = 'src/img/bird1.png';
    document.querySelectorAll('.pipe_sprite_1')
              .forEach((e) => {
      e.remove();
    });
    document.querySelectorAll('.pipe_sprite_2')
              .forEach((e) => {
      e.remove();
    });
    document.querySelectorAll('.coin')
              .forEach((e) => {
      e.remove();
    });
    bird.style.top = '45vh';
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    updateScoreDisplay(score_value)

    game_state = 'Play';
    const birdImages = [
      'src/img/bird1.png',
      'src/img/bird2.png',
      'src/img/bird3.png'
    ];
    
    let currentIndex = 0;
    birdAnimationInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % birdImages.length; // Cycle through images
      bird.src = birdImages[currentIndex]; // Update the image source
    }, 200); // Change image every 200ms
    // Hide the start button if needed
    document.querySelector('.start-button').style.visibility = 'hidden'; 
    document.querySelector('.get-ready').style.visibility = 'hidden';
    document.getElementById('background-music').play();
    // Call any other functions to start the game
    play(); // Assuming you have a play function to start the game loop
}

function endGame() {
  game_state = 'End';
  clearInterval(birdAnimationInterval);
  document.querySelector('.start-button').style.visibility = 'visible';
  document.querySelector('.get-ready').style.visibility = 'visible'; 
  document.getElementById('get-ready-image').src = 'src/img/gameover.png'; // Change to Game Over image
  document.getElementById('get-ready-image').alt = 'Game Over'; // Update alt text
  document.getElementById('bird').src = 'src/img/Flap Death.png';

  // Play Game Over sound
  document.getElementById('game-over-sound').play();

  // Pause background music
  document.getElementById('background-music').pause();
  document.getElementById('background-music').currentTime = 0;
  // update best score
  const savedScore = localStorage.getItem('bestScore');
  if (savedScore) {
    if(savedScore < score_value)
      localStorage.setItem('bestScore', score_value);
  } else {
    localStorage.setItem('bestScore', score_value);
  }
  score_value = 0;
}

function play() {
  function move() {
    
    // Detect if game has ended
    if (game_state != 'Play') return;
    
    // Getting reference to all the pipe elements
    let pipe_sprite1 = document.querySelectorAll('.pipe_sprite_1');
    let pipe_sprite2 = document.querySelectorAll('.pipe_sprite_2');
    let pipe_sprite = [...pipe_sprite1, ...pipe_sprite2];

    // Getting reference to all the coin elements
    let coins = document.querySelectorAll('.coin');

    pipe_sprite.forEach((element) => {
      
      let pipe_sprite_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();
      
      // Delete the pipes if they have moved out
      // of the screen hence saving memory
      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        // Collision detection with bird and pipes
        if (
          bird_props.left < pipe_sprite_props.left +
          pipe_sprite_props.width &&
          bird_props.left +
          bird_props.width > pipe_sprite_props.left &&
          bird_props.top < pipe_sprite_props.top +
          pipe_sprite_props.height &&
          bird_props.top +
          bird_props.height > pipe_sprite_props.top
        ) {
          
          // Change game state and end the game
          // if collision occurs
          endGame();
          return;
        } else {
          // Increase the score if player
          // has the successfully dodged the 
          if (
            pipe_sprite_props.right < bird_props.left &&
            pipe_sprite_props.right + 
            move_speed >= bird_props.left &&
            element.increase_score == '1'
          ) {
            score_value = +score_value + 1;
            updateScoreDisplay(+score_value);
            document.getElementById('score-sound').play();
          }
          element.style.left = 
            pipe_sprite_props.left - move_speed + 'px';
        }
      }
      
    });

    // Check for coin collection
    coins.forEach((element) => {
        let coin_props = element.getBoundingClientRect();
        bird_props = bird.getBoundingClientRect();

        if (coin_props.right <= 0) {
          element.remove();
        } else {
          // Collision detection with bird and coin
          if (
              bird_props.left < coin_props.left + coin_props.width &&
              bird_props.left + bird_props.width > coin_props.left &&
              bird_props.top < coin_props.top + coin_props.height &&
              bird_props.top + bird_props.height > coin_props.top
          ) {
              // Increase score for collecting a coin
              score_value = +score_value + 1;
              updateScoreDisplay(+score_value);
              document.getElementById('score-sound').play(); // Play sound when score increases

              // Remove the coin from the DOM
              element.remove();
          } else {
              // Increase the score if player
              // has the successfully dodged the 
              if (
                coin_props.right < bird_props.left &&
                coin_props.right + 
                move_speed >= bird_props.left &&
                element.increase_score == '1'
              ) {
                score_value = +score_value + 1;
                updateScoreDisplay(+score_value);
                document.getElementById('score-sound').play();
              }
              element.style.left = 
              coin_props.left - move_speed + 'px';
            }
          }
        
    });

    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  
  function apply_gravity() {
    if (game_state != 'Play') return;
    bird_dy = bird_dy + gravity;
    
    document.addEventListener('keydown', (e) => {
      if (e.key == 'ArrowUp' || e.key == ' ') {
        bird_dy = -5;
      }
    });
  
    // Collision detection with bird and window top and bottom
    // if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
    //   // endGame(); // End the game if collision occurs
    //   bird.style.top = 0;
    //   return;
    // }
    if(bird_props.top <= 0) {
      bird.style.top = '0px'; // Set bird position to the top
      bird_dy = gravity;
    }
    if(bird_props.bottom >= background.bottom) {
      bird.style.top = (background.bottom - bird_props.height) + 'px';
      bird_dy = -gravity;
    }
    
    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let pipe_seperation = 0;
  
  // Constant value for the gap between two pipes
  let pipe_gap = 35;
  function create_pipe() {
    if (game_state != 'Play') return;
    
    // Create another set of pipes
    // if distance between two pipe has exceeded
    // a predefined value
    if (pipe_seperation > 115) {
      pipe_seperation = 0
      
      // Calculate random position of pipes on y axis
      let pipe_posi = Math.floor(Math.random() * 43) + 8;
      let pipe_sprite_inv = document.createElement('div');
      pipe_sprite_inv.className = 'pipe_sprite_1';
      pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
      pipe_sprite_inv.style.left = '100vw';
      
      // Append the created pipe element in DOM
      document.body.appendChild(pipe_sprite_inv);
      let pipe_sprite = document.createElement('div');
      pipe_sprite.className = 'pipe_sprite_2';
      pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
      pipe_sprite.style.left = '100vw';
      pipe_sprite.increase_score = '1';
      
      // Append the created pipe element in DOM
      document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);

  
  let coin_separation = 0; // Variable to control coin generation
  
  function createCoin() {
    if (game_state != 'Play') return;

    // Create a coin if the distance between coins has exceeded a predefined value
    if (coin_separation > 115) {
        coin_separation = 0;

        // Calculate random position for the coin on the y-axis
        let coin_posi = Math.floor(Math.random() * 43) + 8;// Adjust for coin height

        // Create the coin element
        let coin = document.createElement('div');
        
        const randomCoin = coins[Math.floor(Math.random() * coins.length)];
        coin.className = `coin ${randomCoin}`;
        // coin.className = 'btc';
        coin.style.top = coin_posi + 'vh'; // Set the random position
        coin.style.left = '85vw'; // Start off-screen

        // Append the coin to the body
        document.body.appendChild(coin);
    }
    coin_separation++;
    requestAnimationFrame(createCoin);
  }
  requestAnimationFrame(createCoin);
}
