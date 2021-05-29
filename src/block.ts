import { Actor, Color, Vector, Label, TextAlign, CollisionType } from "excalibur";
import { game } from "./index";
import { binary, randInt, randNumArray } from "./utils";

export class Block extends Actor {
  public answerOptions: number[];
  // Index of the correct answer in the answerOptions
  public answerIndex: number;

  constructor() {
    const ansI = randInt(0, game.level === 1 ? 1 : 3);
    const ansO = randNumArray(0, 2 ** game.level - 1, 4);

    super({
      x: 200,
      y: 20,
      width: 200,
      height: 40,
      color: Color.fromHex("#43e65e"), // green
      vel: new Vector(0, 60),
      children: [
        new Label({
          color: Color.White,
          text: binary(ansO[ansI], game.level),
          fontSize: 25,
          textAlign: TextAlign.Center,
          y: 14,
          fontFamily: "monospace",
        }),
      ],
    });

    this.body.collider.type = CollisionType.Active;
    this.answerOptions = ansO;
    this.answerIndex = ansI;
  }

  highlight() {
    this.color = Color.Vermilion;
  }
}
