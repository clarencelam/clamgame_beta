import FoodSprite from "/src/foodSprite";

export const CLAMSTATE = {
  ACTIVE: 0,
  STUNNED: 1,
  DEAD: 2
};

export default class Clam {
  constructor(gameWidth, gameHeight) {
    this.img = document.getElementById("clam_default");
    this.flipped_img = document.getElementById("clam_flipped");
    this.GAMEWIDTH = gameWidth;
    this.GAMEHEIGHT = gameHeight;
    this.x_pos = gameWidth / 2 + 10;
    this.y_pos = gameHeight - 100;

    this.size = 75;
    this.height = 75; // specific width/height values for rect collision detection
    this.width = 75;
    this.x_speed = 5;
    this.y_speed = 4;

    this.bullets_held = []; // # of food in hand to fire as bullets

    this.moving_left = false;
    this.moving_right = false;
    this.moving_up = false;
    this.moving_down = false;

    this.facing = 1; // 1 = facing right, -1 = facing left

    this.push_velocity = 30;
    this.pushed_right = false;
    this.pushed_left = false;
    this.shooting = false;
  }

  resetPushVelocity() {
    this.push_velocity = 30;
  }

  update(deltaTime) {
    if (!deltaTime) return;

    if (this.moving_left === true && this.x_pos > 0) {
      this.x_pos = this.x_pos - this.x_speed;
      this.facing = -1; // set facing left
    }
    if (this.moving_right === true && this.x_pos < this.GAMEWIDTH - this.size) {
      this.x_pos = this.x_pos + this.x_speed;
      this.facing = 1; // set facing right
    }
    if (this.moving_up === true && this.y_pos > 0) {
      this.y_pos = this.y_pos - this.y_speed;
    }
    if (this.moving_down === true && this.y_pos < this.GAMEHEIGHT - this.size) {
      this.y_pos = this.y_pos + this.y_speed;
    }

    // update
    this.bullets_held.forEach((bullet, index) => {
      bullet.update(this.x_pos, this.y_pos, this.facing, index);
    });

    if (this.clamWithinBorders() === false) {
      this.pushed_left = false;
      this.pushed_right = false;
    }

    if (this.pushed_right === true) {
      this.x_pos = this.x_pos + this.push_velocity;
      this.push_velocity = this.push_velocity - 1;
      this.moving_left = false;
      if (this.push_velocity === 0) {
        this.pushed_right = false;
        this.resetPushVelocity();
      }
    } else if (this.pushed_left === true) {
      this.x_pos = this.x_pos - this.push_velocity;
      this.push_velocity = this.push_velocity - 1;
      this.moving_right = false;
      if (this.push_velocity === 0) {
        this.pushed_left = false;
        this.resetPushVelocity();
      }
    }
  }

  clamWithinBorders() {
    if (
      this.x_pos > 0 &&
      this.x_pos + this.width < this.GAMEWIDTH &&
      this.y_pos > 0 &&
      this.y_pos + this.height < this.GAMEHEIGHT
    ) {
      return true;
    } else {
      return false;
    }
  }

  newBullet() {
    this.bullets_held.push(new FoodSprite(this.x_pos, this.y_pos));
  }

  /*
  drawShootingTilt(ctx, deg) {
    ctx.save();
    var rad = (deg * Math.PI) / 180;
    ctx.translate(this.x_pos + this.size / 2, this.y_pos + this.size / 2);
    ctx.rotate(rad);

    ctx.drawImage(
      this.img,
      (this.size / 2) * -1,
      (this.size / 2) * -1,
      this.size,
      this.size
    );
    ctx.restore();
  }
  */

  drawHorizontally(ctx, x_pos) {
    ctx.translate(x_pos + this.size, this.y_pos);
    ctx.scale(-1, 1);
    ctx.drawImage(this.img, 0, 0, this.size, this.size);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  draw(ctx) {
    // Draw the clam to the screen. If it is shooting, draw its shooting animation
    switch (true) {
      case this.facing === 1: // facing right, not shooting
        ctx.drawImage(this.img, this.x_pos, this.y_pos, this.size, this.size);
        break;
      case this.facing === -1: // facing left, shooting
        this.drawHorizontally(ctx, this.x_pos);
        break;
      default:
        ctx.drawImage(this.img, this.x_pos, this.y_pos, this.size, this.size);
    }
    ctx.fillText(
      "Food held:" + this.bullets_held.length,
      this.x_pos,
      this.y_pos
    );

    /*
    // draw food sprites
    this.bullets_held.forEach((bullet, index) => {
      bullet.draw(ctx);
    });
    */
    for (var i = this.bullets_held.length - 1; i >= 0; i--) {
      this.bullets_held[i].draw(ctx);
    }
  }
}
