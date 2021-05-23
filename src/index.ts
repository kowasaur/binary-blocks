import { Block } from "./block";
import { Actor, CollisionType, Engine, Random, Timer, Physics, Vector } from "excalibur";

Physics.acc = new Vector(0, 30);

const scoreElement = document.getElementById("score")!;

class Game extends Engine {
  public level = 1;
  public score = 0;
  // TODO: high score that saves in local storage
  private blockList: Block[] = [];

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
  }

  newBlock() {
    const rand = new Random().integer(0, 2 ** this.level - 1);
    const block = new Block(rand);
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
    this.changeScore(1);
  }

  changeScore(amount: number) {
    this.score += amount;
    // TODO: Display score in binary
    scoreElement.innerText = `Score: ${this.score}`;
  }
}

export const game = new Game();

const button = document.getElementById("b1") as HTMLButtonElement;
button.onclick = () => {
  game.removeBlock();
};

game.start();
