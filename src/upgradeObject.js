const UPGRADETYPES = {
  MARKETING: 0, // increase customer spawn
  LOGICSTICS: 1 //increase food cook time
};

export default class UpgradeObject {
  // Class to represent the popup at the end of a level
  constructor(x, y, type, gamestats, kitchen) {
    this.x_pos = x;
    this.y_pos = y;
    this.height = 200;
    this.width = 100;
    this.box_height = 200;
    this.box_width = 1100;
    this.box_x = 100;
    this.box_y = 100;

    this.type = type;
    this.gamestats = gamestats;
    this.kitchen = kitchen;
    this.stat_level = 1;

    switch (this.type) {
      case 0:
        this.cost = 4;
        this.cost_increment = 4;
        this.incrementseconds = -100;
        this.stat_maxlevel = 20;
        break;

      case 1:
        this.cost = 2;
        this.cost_increment = 2;
        this.incrementseconds = -100;
        this.stat_maxlevel = 20;
        break;

      default:
        break;
    }
  }

  onHover(ctx) {
    switch (this.type) {
      case 0:
        this.hovermsg1 = "RESEARCH MARKETING - Increases rate of new customers";
        this.hovermsg2 =
          "CURRENT NEW CUST RATE: Chance of new customer vists every " +
          this.gamestats.custgen_time +
          " seconds";
        this.hovermsg3 =
          "CURENT LEVEL: " + this.stat_level + " NEXT LEVEL COST: " + this.cost;
        break;

      case 1:
        this.hovermsg1 = "RESEARCH LOGISTICS - Increases cooking speed";
        this.hovermsg2 =
          "CURENT COOK SPEED: 1 Food cooked every " +
          this.kitchen.cook_time +
          " seconds";
        this.hovermsg3 =
          "CURENT LEVEL: " + this.stat_level + " NEXT LEVEL COST: " + this.cost;
        break;

      default:
        break;
    }
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillRect(this.box_x, this.box_y, this.box_width, this.box_height);
    ctx.stroke();
    ctx.fillStyle = "black";

    // write tax message
    ctx.fillText(this.hovermsg1, this.box_x + 10, this.box_y + 30);
    ctx.fillText(this.hovermsg2, this.box_x + 10, this.box_y + 60);
    ctx.fillText(this.hovermsg3, this.box_x + 10, this.box_y + 90);
  }

  upgrade() {
    switch (this.type) {
      case 0:
        // gamestats make spawn faster
        if (
          this.gamestats.dollars >= this.cost &&
          this.stat_level < this.stat_maxlevel
        ) {
          this.gamestats.custgen_time =
            this.gamestats.custgen_time + this.incrementseconds;
          this.gamestats.dollars = this.gamestats.dollars - this.cost;
          this.cost = this.cost + this.cost_increment;
          this.stat_level = this.stat_level + 1;
        }
        break;

      case 1:
        // make food cook faster
        if (this.gamestats.dollars >= this.cost) {
          this.kitchen.cook_time =
            this.kitchen.cook_time + this.incrementseconds;
          this.gamestats.dollars = this.gamestats.dollars - this.cost;
          this.cost = this.cost + this.cost_increment;
          this.stat_level = this.stat_level + 1;
        }
        break;

      default:
        break;
    }
  }

  draw(ctx) {
    // draw box to put info in
    /**
     * ctx.fillStyle = this.box_background_color;
    ctx.fillRect(
      this.x_pos,
      this.y_pos,
      this.width,
      this.height
    );
    ctx.stroke();

     */

    // draw outline for box
    ctx.fillStyle = this.box_outline_color;
    ctx.strokeRect(this.x_pos, this.y_pos, this.width, this.height);
  }
}
