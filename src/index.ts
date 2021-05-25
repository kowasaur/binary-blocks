import { Actor, CollisionType, Engine, Timer, Physics } from "excalibur";
import { Block } from "./block";
import { arrayIndexToButtonId, displayStat } from "./utils";

Physics.acc.y = 40;

const buttonElements = [...Array(4).keys()].map(num => document.getElementById(`b${num + 1}`)!);
// TODO: Pause meter after x amount of questions in a row
// TODO: Maybe delete all blocks when level up
class Game extends Engine {
  public level = 1;
  public score = 0;
  // TODO: high score that saves in local storage
  public blockList: Block[] = [];

  private ground: Actor;
  private newBlockLoop: Timer;

  constructor() {
    super({ width: 400, height: 680, canvasElementId: "game" });

    const ground = new Actor({ width: 400, height: 0, x: 200, y: 680 });
    ground.body.collider.type = CollisionType.Fixed;
    this.add(ground);
    this.ground = ground;

    const timer = new Timer({ interval: 5000, repeats: true, fcn: () => this.newBlock() });
    this.add(timer);
    this.newBlockLoop = timer;
  }

  onInitialize() {
    this.newBlock();

    this.displayButtons();
  }

  newBlock() {
    const block = new Block();
    this.blockList.push(block);
    this.add(block);

    // Game over
    if (this.blockList.length === 17) {
      this.canvas.style.animation = "spin 0.5s ease-in-out";
      this.ground.kill();
      Physics.acc.y = 500;
      this.newBlockLoop.cancel();
      const delay = new Timer({ interval: 7000, fcn: () => this.stop() });
      this.addTimer(delay);
      // TODO: Play again button
    }
  }

  removeBlock() {
    this.blockList[0].kill();
    this.blockList.shift();

    if (this.blockList.length === 0) {
      this.newBlock();
      this.newBlockLoop.reset();
    }
  }

  changeScore(amount: number) {
    this.score += amount;
    // TODO: Display score in binary maybe
    displayStat("score", this.score);
  }

  displayButtons() {
    this.blockList[0].highlight();
    const options = this.blockList[0].answerOptions;

    options.forEach((answer, index) => {
      const button = document.getElementById(arrayIndexToButtonId(index))!;
      button.innerText = answer.toString();
    });
    if (options.length > 2) {
      buttonElements[2].style.display = "inline";
      buttonElements[3].style.display = "inline";
    }
  }

  correctAnswer() {
    this.changeScore(1);

    // Increase level
    if (this.score === 2 ** this.level) {
      this.level++;
      displayStat("level", this.level);
      // Remove all blocks currently on screen
      this.blockList.forEach(block => block.kill());
      this.blockList = [];
      this.newBlock();
      this.newBlockLoop.reset();
    } else this.removeBlock();

    this.displayButtons();
  }

  wrongAnswer() {
    const penalty = Math.ceil(this.score * 0.25) * -1;
    this.changeScore(penalty);
    this.newBlock();
    // TODO: Notify the user somehow they are wrong
  }
}

export const game = new Game();

// This function has to be outside of the class since it's what the buttons use
function answer(ev: MouseEvent) {
  const button = ev.target as HTMLButtonElement;
  const correctId = arrayIndexToButtonId(game.blockList[0].answerIndex);

  if (button.id === correctId) game.correctAnswer();
  else game.wrongAnswer();
}

buttonElements.forEach(button => (button.onclick = answer));

game.start();
