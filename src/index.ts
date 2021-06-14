import { Actor, CollisionType, Engine, Timer, Physics } from "excalibur";
import { Block } from "./block";
import { arrayIndexToButtonId, displayStat } from "./utils";

// This sets the global acceleration to 60, essentially acting as gravity
Physics.acc.y = 60;

const buttonContainer = document.getElementById("buttons")!;
const refreshButton = document.getElementById("refresh")!;
const binaryCheckbox = document.getElementById("displayInBinary")!;
/* This gets the array of [1,2,3,4] and then creates a new array made of 
HTML elements where each one has an id of b + each element in the number array.
Basically it makes [b1, b2, b3, b4] but each element a reference to the actual html element */
const buttonElements = [1, 2, 3, 4].map(num => document.getElementById(`b${num}`)!);

// This class is the actual game using Excalibur's engine
class Game extends Engine {
  public level = 1;
  public score = 0;
  public highscore;
  public displayInBinary = false;
  public blockList: Block[] = [];

  private ground: Actor;
  private newBlockLoop: Timer;

  // This function is run when the class is instantiated
  constructor() {
    /* super() is used to pass arguments to the constructor of the engine.
    here it's giving the engine a width and height and saying what canvas element to use */
    super({ width: 400, height: 680, canvasElementId: "game" });

    // This creates an invisble ground at the bottom of the screen for the block to land on
    const ground = new Actor({ width: 400, height: 0, x: 200, y: 680 });
    ground.body.collider.type = CollisionType.Fixed;
    this.add(ground);
    this.ground = ground;

    // This creates an infinite loop that creates a new block every 5 seconds
    const timer = new Timer({ interval: 5000, repeats: true, fcn: () => this.newBlock() });
    this.add(timer);
    this.newBlockLoop = timer;

    /* This looks in the browser's localstorage for the highscore
    if it exists it sets the highscore to that and displays it,
    if it doesn't exist it'll throw an error and so will run the catch block
    which sets the highscore to 0 */
    try {
      this.highscore = Number(localStorage.getItem("highscore"));
      displayStat("highscore", this.highscore, true, false);
    } catch {
      this.highscore = 0;
    }
  }

  /* This function runs after the Excalibur engine has initiated */
  onInitialize() {
    this.newBlock();

    this.displayButtons();
  }

  /* This function adds a new block to the game and also ends the game 
  if there's 17 blocks (enough to fill the canvas) */
  newBlock() {
    const block = new Block();
    // Adds a reference to the block to the blockList array
    this.blockList.push(block);
    // Actually adds the block to the game so it's visible
    this.add(block);

    // Game over
    if (this.blockList.length === 17) {
      // Hides the buttons so the user can't destroy anymore blocks
      buttonContainer.style.display = "none";
      // Makes the canvas spin
      this.canvas.style.animation = "spin 0.5s ease-in-out";
      // Removes the ground so the blocks fall
      this.ground.kill();
      // Increases gravity by a lot so they fall quickly
      Physics.acc.y = 500;
      // Stop spawning new blocks
      this.newBlockLoop.cancel();
      // Stop the game completely (so it doesn't do anymore calculations) after 7 seconds
      const delay = new Timer({ interval: 7000, fcn: () => this.stop() });
      this.addTimer(delay);
      // Make the refresh buton visible
      refreshButton.style.display = "block";
    }
  }

  // Removes a block from the game
  removeBlock() {
    // Gets rid of the first block in the blockList array from the game
    this.blockList[0].kill();
    // Removes the reference to that block from the blockList array
    this.blockList.shift();

    // If there's no more blocks left on screen it makes a new one
    if (this.blockList.length === 0) {
      this.newBlock();
      /* Resets the timer that makes new blocks every 5 seconds so that you don't have
      to blocks spawning at the same time (or nearly the same time) */
      this.newBlockLoop.reset();
    }
  }

  // This updates the user's score
  changeScore(amount: number) {
    // Increases the score by the amount
    this.score += amount;

    const newScore = this.score;
    /* Displays the score on screen. If the change in score is positive it makes it flash 
    green and red if it's not. It also display it in binary if the user has the checkbox selected*/
    displayStat("score", newScore, amount > 0, this.displayInBinary);

    // If the user score's is now a highscore for them, it updates the highscore as well
    if (newScore > this.highscore) {
      this.highscore = newScore;
      displayStat("highscore", newScore, amount > 0, this.displayInBinary);
      /* Saves the highscore to localstorage 
      (meaning it will stay on their computer unless they manually delete it) */
      localStorage.setItem("highscore", newScore.toString());
    }
  }

  // This updates the buttons with the different possible answers
  displayButtons() {
    // Makes the block at the bottom orange
    this.blockList[0].highlight();
    const options = this.blockList[0].answerOptions;

    // For each of the possible answers it gets a button and makes the button's text the answer
    options.forEach((answer, index) => {
      const button = document.getElementById(arrayIndexToButtonId(index))!;
      button.innerText = answer.toString();
    });

    /* This exists since in the first level there's only 2 options (0 and 1) 
    It just makes the other buttons visible if there's more than 2 options */
    if (options.length > 2) {
      buttonElements[2].style.display = "inline";
      buttonElements[3].style.display = "inline";
    }
  }

  // This function runs when the user gets the answer right
  correctAnswer() {
    // Increases the score by 1
    this.changeScore(1);

    /* The levels increase by powers of 2 so if the score is equal to the 
    2 to the power of the level then it increases the level */
    if (this.score === 2 ** this.level) {
      this.level++;
      // Displays the new level
      displayStat("level", this.level, true, this.displayInBinary);
      // Remove all blocks currently on screen
      this.blockList.forEach(block => block.kill());
      this.blockList = [];
      // Creates a new block
      this.newBlock();
      // Resets the new block loop so there's not two blocks spawned at the same time
      this.newBlockLoop.reset();
      // If there isn't a level increase, it just removes the bottom most block
    } else this.removeBlock();

    // Shows the answer options for the next block
    this.displayButtons();
  }

  // This function runs when the user gets the answer wrong
  wrongAnswer() {
    // The penalty is 10% of the user's score, rounded up to the nearest integer
    const penalty = Math.ceil(this.score * 0.1) * -1;
    // Lowers the score
    this.changeScore(penalty);
    // Makes a new block spawn
    this.newBlock();
  }

  // Toggles whether the scores are displayed in binary or normal numbers
  toggleBinaryDisplay() {
    // flips whether it's true or false
    game.displayInBinary = !game.displayInBinary;

    // Update all of the stats on screen
    displayStat("level", this.level, true, this.displayInBinary);
    displayStat("score", this.score, true, this.displayInBinary);
    displayStat("highscore", this.highscore, true, this.displayInBinary);
  }
}

// Instantiates the game and exports it so other files can access it
export const game = new Game();

/* This function has to be outside of the class since it's what the buttons use.
it is called whenever the user clicks an answer */
function answer(ev: MouseEvent) {
  // Gets the button
  const button = ev.target as HTMLButtonElement;
  // Gets the correct answer id
  const correctId = arrayIndexToButtonId(game.blockList[0].answerIndex);

  // If the button's id is the same as the correct answer it calls the correctAnswer() function
  if (button.id === correctId) game.correctAnswer();
  // If it's wrong it calls the wrongAnswer() funcion
  else game.wrongAnswer();
}

// Makes all of the answer buttons call the answer function when you click it
buttonElements.forEach(button => (button.onclick = answer));

// Makes it so when you click the checkbox it toggles whether the stats display in binary
binaryCheckbox.onclick = () => game.toggleBinaryDisplay();

// Starts the game
game.start();
