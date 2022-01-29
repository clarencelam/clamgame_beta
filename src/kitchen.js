export default class Kitchen {
  // Class to represent the food objects used as bullets in the game
  constructor(gameWidth, gameHeight) {
    this.image = document.getElementById("foodstand");
    this.food_img1 = document.getElementById("nigiri_img");
    this.game_height = gameHeight;

    this.truck_width = 375;
    this.truck_height = 200;

    this.x_pos = 100;
    this.y_pos = 112;

    this.max_food = 5;
    this.cooked_food = [];

    this.size = 400;
    this.cooked_food_size = 50;

    this.number_pos_x = 40;
    this.number_pos_y = gameHeight * (2 / 3);

    this.cooking = false;
    this.cook_time = 2000;
  }

  update(deltaTime) {
    this.cooked_food = this.cooked_food.filter(
      (bullet) => !bullet.marked_for_deletion
    );

    this.cooked_food.forEach((food, index) => {
      food.update();
    });
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.x_pos,
      this.y_pos,
      this.truck_width,
      this.truck_height
    );
    this.cooked_food.forEach((food, index) => {
      food.draw(ctx);
    });
  }
}
/*
    ctx.textAlign = "left";
    ctx.font = "25px Tahoma";
    ctx.fillStyle = "black";
*/
