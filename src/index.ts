import { Actor, CollisionType, Engine, Timer, Physics, Vector } from "excalibur";
import { Block } from "./block";
import { arrayIndexToButtonId, displayStat } from "./utils";

Physics.acc = new Vector(0, 40);

const buttonElements = [...Array(4).keys()].map(num => document.getElementById(`b${num + 1}`)!);

class Game extends Engine {
  public level = 1;
  public score = 0;
  // TODO: high score that saves in local storage
  public blockList: Block[] = [];

  constructor() {
    super({ width: 400, height: 680, canvasElementId: "game" });

    const ground = new Actor({ width: 400, height: 0, x: 200, y: 680 });
    ground.body.collider.type = CollisionType.Fixed;
    this.add(ground);

    const timer = new Timer({ interval: 5000, repeats: true, fcn: () => this.newBlock() });
    this.add(timer);
  }

  onInitialize() {
    this.newBlock();

    this.displayButtons();
  }

  newBlock() {
    const block = new Block();
    this.blockList.push(block);
    this.add(block);
    if (this.blockList.length === 17) {
      this.stop();
      alert("Game over");
    }
  }

  removeBlock() {
    this.blockList[0].kill();
    this.blockList.shift();

    if (this.blockList.length === 0) this.newBlock();

    this.displayButtons();
    this.changeScore(1);
  }

  changeScore(amount: number) {
    this.score += amount;
    // TODO: Display score in binary maybe
    displayStat("score", this.score);

    // Increase level
    if (this.score === 2 ** this.level) {
      this.level++;
      displayStat("level", this.level);
    }
  }

  displayButtons() {
    this.blockList[0].highlight();
    const options = this.blockList[0].answerOptions;
    console.log(options);

    options.forEach((answer, index) => {
      const button = document.getElementById(arrayIndexToButtonId(index))!;
      button.innerText = answer.toString();
    });
    if (options.length > 2) {
      buttonElements[2].style.display = "inline";
      buttonElements[3].style.display = "inline";
    }
  }

  penalise() {
    // TODO
    alert("bad");
  }
}

export const game = new Game();

// This function has to be outside of the class since it's what the buttons use
function answer(ev: MouseEvent) {
  const button = ev.target as HTMLButtonElement;

  const correctId = arrayIndexToButtonId(game.blockList[0].answerIndex);
  console.log(button.id);
  console.log(correctId);
  if (button.id === correctId) {
    game.removeBlock();
  } else {
    game.penalise();
  }
}

buttonElements.forEach(button => (button.onclick = answer));

game.start();
