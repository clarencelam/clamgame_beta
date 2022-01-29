import { randomIntFromInterval } from "/src/gameMechanics";

export const FOODSTATE = {
  INKITCHEN: 0,
  SERVED: 1,
  BEINGEATEN: 2
};

export default class Food {
  // Class to represent the food objects used as bullets in the game
  constructor(x, y, facing, state = FOODSTATE.SERVED, kitchen) {
    this.state = state;

    this.image = document.getElementById("nigiri_img");
    this.x_pos = x;
    this.y_pos = y;
    this.size = 50;
    this.speed = 10;

    this.speed_depricator = 0.2;
    this.fade_time = 180;

    this.fade_depricator = 1;
    this.marked_for_deletion = false;

    this.hunger_fill = 1;
    this.pickupable = false;

    this.direction = facing; // 1 if right, -1 if left

    this.deg = 0;

    if (this.state === FOODSTATE.INKITCHEN) {
      let rnd_speed = randomIntFromInterval(2, 9);
      this.speed = rnd_speed;
    }
  }

  resetStats() {
    this.speed = 10;
  }

  advanceSpinDegree() {
    // increases the degree of this.deg to spin food
    this.deg = this.deg + 2;
  }

  drawHelper(ctx) {
    // draws food with tilt degree = this.deg
    ctx.save();
    var rad = (this.deg * Math.PI) / 180;
    ctx.translate(this.x_pos + this.size / 2, this.y_pos + this.size / 2);
    ctx.rotate(rad);
    ctx.drawImage(
      this.image,
      (this.size / 2) * -1,
      (this.size / 2) * -1,
      this.size,
      this.size
    );
    ctx.restore();
  }

  draw(ctx) {
    if (this.spinning === true) {
      // draw food and advance spin
      this.drawHelper(ctx);
      this.advanceSpinDegree();
    } else {
      // draw food no spin
      this.drawHelper(ctx);
    }
  }

  update(deltaTime) {
    this.x_pos += this.speed * this.direction;
    if (this.speed > 0) {
      this.speed = this.speed - this.speed_depricator;
    } else {
      this.speed = 0;
    }

    if (this.state === FOODSTATE.SERVED) {
      this.spinning = true;
      this.pickupable = true;

      if (this.fade_time > 0) {
        this.fade_time = this.fade_time - this.fade_depricator;
      } else {
        this.fade_time = 0;
        this.marked_for_deletion = true;
      }
    }

    if (this.state === FOODSTATE.BEINGEATEN) {
      this.speed = 0;
      this.spinning = false;
      this.pickupable = false;
    }
  }
}
