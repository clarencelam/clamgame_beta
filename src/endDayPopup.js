export default class EndDayPopup {
  // Class to represent the popup at the end of a level
  constructor(gamewidth, gameheight, numFed, numCoins, tax) {
    this.gamewidth = gamewidth;
    this.gameheight = gameheight;
    this.height = 180;
    this.width = 700;
    this.box_title = "BUSINESS DAY OVER";
    this.numFed = numFed;
    this.numCoins = numCoins;
    this.tax = tax;

    this.screen_centered_x = this.gamewidth / 2 - this.width / 2;
    this.screen_centered_y = this.gameheight / 2 - this.height / 2;
    this.screen_bottom_y = this.gameheight - this.height;

    this.x_pos = this.screen_centered_x;
    this.y_pos = this.screen_bottom_y - 10;

    this.box_background_color = "white";
    this.box_outline_color = "black";
    this.default_font = "20px Tahoma";
  }

  update() {}

  draw(ctx) {
    // draw box to put info in
    ctx.fillStyle = this.box_background_color;
    ctx.textAlign = "left";
    ctx.font = "25px Tahoma";

    ctx.fillRect(this.x_pos, this.y_pos, this.width, this.height);
    ctx.stroke();

    // draw outline for box
    ctx.fillStyle = this.box_outline_color;
    ctx.strokeRect(this.x_pos, this.y_pos, this.width, this.height);
    ctx.font = this.default_font;
    ctx.fillText(this.box_title, this.x_pos + 10, this.y_pos + 30);
    ctx.font = this.default_font;
    ctx.fillText(
      "Customers Fed: " + this.numFed,
      this.x_pos + 10,
      this.y_pos + 60
    );
    ctx.fillText(
      "Dollars Earned: " + this.numCoins,
      this.x_pos + 10,
      this.y_pos + 90
    );
    ctx.fillText(
      "Clean up the Kitchen's Food, & then press SPACEBAR to end the business day.",
      this.x_pos + 10,
      this.y_pos + 150
    );
  }
}
