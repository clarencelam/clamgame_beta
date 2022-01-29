export default class TwoLinePopup {
  // Class to represent the popup at the end of a level
  constructor(box_x, box_y, line1, line2) {
    this.x_pos = box_x;
    this.y_pos = box_y;
    this.height = 100;
    this.width = 600;

    this.screen_centered_x = this.x_pos - this.width / 2;
    this.screen_centered_y = this.y_pos - this.height / 2;

    this.box_background_color = "#B3EFF7";
    this.box_outline_color = "black";
    this.default_font = "20px Tahoma";

    this.message1 = line1;
    this.message2 = line2;
  }

  update() {}

  draw(ctx) {
    // draw box to put info in
    ctx.fillStyle = this.box_background_color;
    ctx.fillRect(
      this.screen_centered_x,
      this.screen_centered_y,
      this.width,
      this.height
    );
    ctx.stroke();

    // draw outline for box
    ctx.fillStyle = this.box_outline_color;
    ctx.strokeRect(
      this.screen_centered_x,
      this.screen_centered_y,
      this.width,
      this.height
    );
    ctx.font = this.default_font;

    // write tax message
    ctx.fillText(
      this.message1,
      this.screen_centered_x + 10,
      this.screen_centered_y + 30
    );
    ctx.fillText(
      this.message2,
      this.screen_centered_x + 10,
      this.screen_centered_y + 60
    );
  }
}
