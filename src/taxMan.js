export default class TaxMan {
  // Class to represent coin objects
  constructor(x, y, days_tax) {
    this.image = document.getElementById("taxman1");
    this.x_pos = x;
    this.y_pos = y;
    this.width = 115 + 40;
    this.height = 75 + 40;

    this.popup_x = this.x_pos - 500;
    this.popup_y = this.y_pos - 300;
    this.popup_width = 600;
    this.popup_height = 200;

    this.line1 = "Hello Clam. Today's tax is $" + days_tax;
    this.line2 =
      "Press spacebar to pay and we will ensure your spot in Maple Island";
    this.line3 = "If you don't pay though, we cannot promise your protection";
    this.line4 = "from the more... malevolent citizens...";
  }

  drawTextLine(ctx, line, linenum) {
    ctx.fillText(
      line,
      this.popup_x + this.popup_width / 2,
      this.popup_y + 30 * linenum
    );
  }

  drawPopup(ctx) {
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

    this.drawTextLine(ctx, this.line1, 1);
    this.drawTextLine(ctx, this.line2, 2);
    this.drawTextLine(ctx, this.line3, 3);
    this.drawTextLine(ctx, this.line4, 4);
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x_pos, this.y_pos, this.width, this.height);
  }

  update(deltaTime) {
    return;
  }
}
