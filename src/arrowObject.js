export default class ArrowObject {
  // Class to represent the guide arrows guiding clam around the game
  constructor(x, y, is_facing_right, message) {
    this.x_pos = x;
    this.y_pos = y;
    this.is_facing_right = is_facing_right; //boolean
    this.message = message;
    this.img = document.getElementById("arrow");
    // This img is a square
    this.width = 200;
    this.height = 200;

    this.popup_x = 300;
    this.popup_y = 600;
    this.popup_width = 600;
    this.popup_height = 100;
  }

  drawPopup(ctx) {
    console.log("draw popup");
    ctx.fillStyle = "#B3EFF7";

    ctx.fillRect(
      this.popup_x,
      this.popup_y,
      this.popup_width,
      this.popup_height
    );
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.strokeRect(
      this.popup_x,
      this.popup_y,
      this.popup_width,
      this.popup_height
    );

    ctx.textAlign = "center";
    ctx.font = "20px Tahoma";

    ctx.fillText(
      this.message,
      this.popup_x + this.popup_width / 2,
      this.popup_y + 30
    );
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x_pos, this.y_pos, this.width, this.height);
  }
}
