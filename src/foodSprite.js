export default class FoodSprite {
  // Class to represent the food objects used as bullets in the game
  constructor(x, y) {
    this.image = document.getElementById("nigiri_img");

    this.food_type = "nigiri";

    this.x_pos = x;
    this.y_pos = y;
    this.size = 25;
    this.marked_for_deletion = false;
  }

  update(clam_x, clam_y, direction, index, deltaTime) {
    // update sprite to follow clam object
    if (direction === 1) {
      this.x_pos = clam_x + 15 + this.size / 2 - (index * this.size) / 3;
      this.y_pos = clam_y + index ** 2;
    } else {
      this.x_pos = clam_x + 15 + this.size / 2 + (index * this.size) / 3;
      this.y_pos = clam_y + index ** 2;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x_pos, this.y_pos, this.size, this.size);
  }
}
