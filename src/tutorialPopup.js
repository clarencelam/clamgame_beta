export default class TutorialPopup {
  // Class to represent the popup at the end of a level
  constructor(gamewidth, gameheight, timerlength, taxamount) {
    this.gamewidth = gamewidth;
    this.gameheight = gameheight;
    this.height = 380;
    this.width = 800;
    this.timer_length = timerlength;
    this.tax_amount = taxamount;

    this.screen_centered_x = this.gamewidth / 2;
    this.screen_centered_y = this.gameheight / 2;

    this.box_background_color = "#B3EFF7";
    this.box_outline_color = "black";
    this.default_font = "20px Tahoma";

    this.box_title = "WELCOME TO CHEF CLAM";
    this.box_line1 = "You've come to Maple Island with a humble dream:";
    this.box_line2 =
      "To make a living cooking food and serving it to the community";
    this.box_line3 = "INSTRUCTIONS:";
    this.box_line4 = "Move with ARROW KEYS or WASD. Throw items with SPACEBAR";
    this.box_line5 =
      "Collect food from your food truck and feed as many customers as you can!";
    this.box_line6 = "But make sure you make enough money to pay the tax.";
    this.box_line7 =
      "And be careful for thieves-- a rock or two should keep them away";
    this.box_line8 = "TODAY'S WORKDAY: " + this.timer_length + " SECONDS";
    this.box_line9 = "TAX OWED AT END OF DAY: " + this.tax_amount + " DOLLARS";
    this.box_line10 = "Walk RIGHT to begin the workday";
  }

  drawTextLine(ctx, line, linenum) {
    ctx.fillText(
      line,
      this.screen_centered_x,
      this.screen_centered_y - this.height / 2 + 30 * linenum
    );
  }

  draw(ctx) {
    // draw box to put info in
    ctx.fillStyle = this.box_background_color;
    ctx.fillRect(
      this.screen_centered_x - this.width / 2,
      this.screen_centered_y - this.height / 2,
      this.width,
      this.height
    );
    ctx.stroke();

    // draw outline for box
    ctx.fillStyle = this.box_outline_color;
    ctx.strokeRect(
      this.screen_centered_x - this.width / 2,
      this.screen_centered_y - this.height / 2,
      this.width,
      this.height
    );

    ctx.font = this.default_font;
    ctx.textAlign = "center";

    this.drawTextLine(ctx, this.box_title, 1);
    this.drawTextLine(ctx, this.box_line1, 2);
    this.drawTextLine(ctx, this.box_line2, 3);
    this.drawTextLine(ctx, this.box_line3, 4);
    this.drawTextLine(ctx, this.box_line4, 5);
    this.drawTextLine(ctx, this.box_line5, 6);
    this.drawTextLine(ctx, this.box_line6, 7);
    this.drawTextLine(ctx, this.box_line7, 8);
    this.drawTextLine(ctx, this.box_line8, 9);
    this.drawTextLine(ctx, this.box_line9, 10);
    this.drawTextLine(ctx, this.box_line10, 11);
  }
}
