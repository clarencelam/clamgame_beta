export default class BeginDayPopup {
  // Class to represent the popup at the end of a level
  constructor(gamewidth, gameheight, daynumber, timerlength, taxamount) {
    this.gamewidth = gamewidth;
    this.gameheight = gameheight;
    this.height = 200;
    this.width = 800;

    this.day_number = daynumber;
    this.timer_length = timerlength;
    this.tax_amount = taxamount;

    this.screen_centered_x = this.gamewidth / 2 - this.width / 2;
    this.screen_centered_y = this.gameheight / 2 - this.height / 2;
    this.screen_bottom_y = this.gameheight - this.height;

    this.x_pos = this.screen_centered_x;
    this.y_pos = this.screen_bottom_y - 10;

    this.box_background_color = "white";
    this.box_outline_color = "black";
    this.default_font = "20px Tahoma";

    this.box_title = "Good Morning & Congratulations!";
    this.box_line1 = "You've made it to Day #" + this.day_number + ".";
    this.box_line2 = "Today's work day is " + this.timer_length + " seconds.";
    this.box_line3 =
      "At the end of day, the Tax office wants " + this.tax_amount + " COINS";
    this.box_line4 = "Now, pick up the sushi to start,";
    this.box_line5 = "and hope for a good day of business!";
  }

  drawTextLine(ctx, line, linenum) {
    ctx.fillText(line, this.x_pos + 10, this.y_pos + 30 * linenum);
  }

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
    ctx.textAlign = "left";

    this.drawTextLine(ctx, this.box_title, 1);
    this.drawTextLine(ctx, this.box_line1, 2);
    this.drawTextLine(ctx, this.box_line2, 3);
    this.drawTextLine(ctx, this.box_line3, 4);
    this.drawTextLine(ctx, this.box_line4, 5);
    this.drawTextLine(ctx, this.box_line5, 6);
  }
}
