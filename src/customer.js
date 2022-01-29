import { randomIntFromInterval, incrementalAction } from "/src/gameMechanics";

export const CUSTSTATE = {
  ACTIVE: 0,
  EATING: 1,
  EXITING: 2,
  DROPPINGLOOT: 3
};

export default class Customer {
  // class to represent the cusomter fish that player will feed

  constructor(gameWidth, gameHeight) {
    this.GAMEWIDTH = gameWidth;
    this.GAMEHEIGHT = gameHeight;
    this.state = CUSTSTATE.ACTIVE;
    this.saturated = false;

    this.img_frame1 = document.getElementById("cust_baseA");
    this.img_frame2 = document.getElementById("cust_baseB");

    this.height = 25 + 8;
    this.width = 37 + 8;

    this.speed = 3;
    this.return_speed = 4; // applies on CUSTSTATE.DONEEATING

    this.hunger_points = 2;
    this.drop_value = 1;

    this.markfordelete = false;

    this.min = 300;
    this.max = gameHeight;

    this.rndBinary = randomIntFromInterval(1, 2);
    const rndInt = randomIntFromInterval(this.min, this.max);

    if (this.rndBinary === 1) {
      this.x_pos = gameWidth - this.width; // Start on right side
    } else {
      this.x_pos = 0; // Start on left side
    }
    this.y_pos = rndInt;

    if (this.rndBinary === 1) {
      this.x_direction = -1;
    } else {
      this.x_direction = 1;
    }
    this.y_direction = 0; //no vertical movement to start
  }

  update(deltaTime) {
    // Movement
    this.x_pos = this.x_pos + this.speed * this.x_direction;
    this.y_pos = this.y_pos + this.speed * this.y_direction;

    if (this.state === CUSTSTATE.EATING) {
      this.walking = false;
      this.speed = 0;
    }

    if (this.state === CUSTSTATE.EXITING) {
      this.walking = true;
      this.y_direction = -1;
      this.speed = this.return_speed;
    }

    // CHECK DELETE
    this.checkOutsideBorders();
  }

  draw(ctx) {
    // swap the image frames per second when cust is walking
    const newtime = new Date();
    let s = newtime.getMilliseconds();
    if (this.state === CUSTSTATE.ACTIVE || this.state === CUSTSTATE.EXITING) {
      if (s < 500) {
        this.img = this.img_frame1;
      } else {
        this.img = this.img_frame2;
      }
    }

    if (this.rndBinary === 2) {
      // GENERATE CUSTOMER FACING RIGHT
      ctx.translate(this.x_pos + this.width, this.y_pos);
      // scaleX by -1; this "trick" flips horizontally
      ctx.scale(-1, 1);
      // draw the img
      // no need for x,y since we've already translated
      ctx.drawImage(this.img, 0, 0, this.width, this.height);
      // always clean up -- reset transformations to default
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      // GENERATE CUSTOMER FACING LEFT
      ctx.drawImage(this.img, this.x_pos, this.y_pos, this.width, this.height);
    }
  }

  checkOutsideBorders() {
    // Delete customers when they cross the screen & exit
    if (
      (this.x_pos > this.GAMEWIDTH && this.x_direction === 1) ||
      (this.x_pos + this.width < 0 && this.x_direction === -1) ||
      this.y_pos < 0
    ) {
      this.markfordelete = true;
    }
  }
}
