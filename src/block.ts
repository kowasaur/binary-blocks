import { Actor, Color, Vector, Label, TextAlign, CollisionType } from "excalibur";
import { game } from "./index";
import { binary } from "./utils";

export class Block extends Actor {
  constructor(num: number) {
    super({
      x: 200,
      y: 20,
      width: 200,
      height: 40,
      color: Color.Black,
      vel: new Vector(0, 50),
      children: [
        new Label({
          color: Color.White,
          text: binary(num, game.level),
          fontSize: 25,
          textAlign: TextAlign.Center,
          y: 14,
        }),
      ],
    });
    this.body.collider.type = CollisionType.Active;
  }
}
