import GameStats from "/src/gameStats";
import Clam from "/src/clam";
import InputHandler from "/src/input";
import Kitchen from "/src/kitchen";
import Customer from "/src/customer";
import Thug from "/src/thug";
import Coin from "/src/coin";
import Food from "/src/food";
import {
  detectCollision,
  detectOverlapCollision,
  randomIntFromInterval,
  detectRectCollision
} from "/src/gameMechanics";
import { CUSTSTATE } from "/src/customer";
import { FOODSTATE } from "/src/food";
import { THIEFSTATE } from "/src/thug";

import TutorialPopup from "/src/tutorialPopup";
import EndDayPopup from "/src/endDayPopup";
import Portal from "/src/portal";
import BeginDayPopup from "./beginDayPopup";
import TaxMan from "./taxMan";
import UpgradeObject from "./upgradeObject";

import { CLAMSTATE } from "./clam";

export const GAMESTATE = {
  BUSINESSDAY: 0,
  NIGHT: 1,
  MENU: 2,
  TUTORIAL: 3,
  ENDDAY: 4,
  NEXTLEVEL: 5,
  GAMEOVER: 6,
  TAXHOUSE: 7,
  INHOME: 8,
  INCITY1: 9,
  INHOOD_NIGHT: 10,
  INHOOD_DAY: 11,
  UPGRADEROOM: 12,
  RESTO: 13,
  INCITY2: 14
};

export default class GameManager {
  constructor(gameWidth, gameHeight, ctx) {
    this.ctx = ctx;
    this.GAME_WIDTH = gameWidth;
    this.GAME_HEIGHT = gameHeight;

    this.background = document.getElementById("background");
    this.night_bg = document.getElementById("night_bg");
    this.nighttown1 = document.getElementById("nighttown1");
    this.nighttown2 = document.getElementById("nighttown2");
    this.car = document.getElementById("car");
    this.hood_bg = document.getElementById("hood_bg");
    this.hood_bg_day = document.getElementById("hood_bg_day");

    this.clam = new Clam(this.GAME_WIDTH, this.GAME_HEIGHT);

    new InputHandler(ctx, this.clam);
    this.gamestate = GAMESTATE.MENU;
    this.spacebarHandler();
  }

  start() {
    // start new game
    this.gameStats = new GameStats(this.GAME_WIDTH, this.GAME_HEIGHT);

    this.bullets = [];
    this.coins = [];
    this.popups = [];
    this.npcs = [];
    this.customers = [];
    this.thugs = [];
    this.portals = [];
    this.upgrades = [];
    this.kitchen = new Kitchen(this.GAME_WIDTH, this.GAME_HEIGHT);

    // For now, just start with game running

    this.upgrades.push(
      new UpgradeObject(800, 500, 0, this.gameStats, this.kitchen)
    );
    this.upgrades.push(
      new UpgradeObject(400, 500, 1, this.gameStats, this.kitchen)
    );
  }

  update(deltaTime) {
    switch (this.gamestate) {
      // ----- GAMESTATE = BUSINESSDAY -----
      case GAMESTATE.BUSINESSDAY:
        this.thugs = this.gameStats.thugs; // makes thug list inherit from gamestats
        this.thugs.forEach((thug) => initializeThugRandomMovement(thug));
        this.updateThugs();
        this.thugs = this.thugs.filter((thug) => !thug.markfordelete);

        this.kitchen.update(deltaTime);
        // this.generateCustomers();
        this.customers = this.customers.filter(
          (customer) => !customer.markfordelete
        );
        this.customers = this.gameStats.custs; // makes customer list inherit from gamestats
        this.updateCustomers(deltaTime);

        this.checkClamGettingFood();
        this.bullets = this.bullets.filter(
          (bullet) => !bullet.marked_for_deletion
        );
        this.updateBullets(this.bullets, deltaTime);
        this.coins = this.coins.filter((coin) => !coin.marked_for_deletion);
        this.updateCoins(this.coins);
        this.clam.update(deltaTime);

        if (this.gameStats.business_day_timer <= 0) {
          this.goToGamestate(GAMESTATE.ENDDAY);
          console.log("TIMER UP");
        }
        break;

      case GAMESTATE.TAXHOUSE:
      case GAMESTATE.INHOME:
      case GAMESTATE.UPGRADEROOM:
      case GAMESTATE.RESTO:
        this.clam.update(deltaTime);
        break;

      case GAMESTATE.INCITY1:
        this.clam.update(deltaTime);
        if (this.clam.x_pos + this.clam.width >= this.GAME_WIDTH) {
          this.goToGamestate(GAMESTATE.INCITY2);
        }
        break;

      case GAMESTATE.INCITY2:
        this.clam.update(deltaTime);
        if (this.clam.x_pos <= 0) {
          this.goToGamestate(GAMESTATE.INCITY1);
        }
        break;

      case GAMESTATE.NIGHT:
        this.clam.update(deltaTime);
        if (this.clam.x_pos <= 0) {
          this.goToGamestate(GAMESTATE.INHOOD_NIGHT);
        }
        break;

      case GAMESTATE.INHOOD_NIGHT:
        this.clam.update(deltaTime);
        if (this.clam.x_pos + this.clam.width >= this.GAME_WIDTH) {
          this.goToGamestate(GAMESTATE.NIGHT);
        }
        break;

      case GAMESTATE.INHOOD_DAY:
        this.clam.update(deltaTime);
        if (this.clam.x_pos + this.clam.width >= this.GAME_WIDTH) {
          this.goToGamestate(GAMESTATE.BUSINESSDAY);
        }

        break;

      case GAMESTATE.ENDDAY:
        this.kitchen.update(deltaTime);
        this.updateCustomers(deltaTime);
        this.coins = this.coins.filter((coin) => !coin.marked_for_deletion);

        this.updateCoins(this.coins);
        this.checkClamGettingFood();

        this.thugs = this.gameStats.thugs; // makes thug list inherit from gamestats
        this.thugs = this.thugs.filter((thug) => !thug.markfordelete);
        this.updateThugs();

        this.bullets = this.bullets.filter(
          (bullet) => !bullet.marked_for_deletion
        );
        this.updateBullets(this.bullets, deltaTime);

        this.clam.update(deltaTime);

        break;

      case GAMESTATE.TUTORIAL:
      case GAMESTATE.NEXTLEVEL:
        // Show popup, update objects needed in tutorial
        //this.kitchen.update(deltaTime);
        this.checkClamGettingFood();
        this.bullets = this.bullets.filter(
          (bullet) => !bullet.marked_for_deletion
        );
        //this.updateBullets(this.bullets, deltaTime);
        this.clam.update(deltaTime);

        if (this.clam.x_pos + this.clam.width >= this.GAME_WIDTH) {
          this.goToGamestate(GAMESTATE.BUSINESSDAY);
          console.log("clam went to right, go to business day");
        }
        break;

      case GAMESTATE.GAMEOVER:
        this.kitchen.update(deltaTime);
        this.updateCustomers(deltaTime);
        this.coins = this.coins.filter((coin) => !coin.marked_for_deletion);

        this.updateCoins(this.coins);
        this.checkClamGettingFood();

        this.bullets = this.bullets.filter(
          (bullet) => !bullet.marked_for_deletion
        );
        this.updateBullets(this.bullets, deltaTime);

        this.clam.update(deltaTime);
        break;

      default:
    }
  }
  draw(ctx) {
    switch (this.gamestate) {
      case GAMESTATE.BUSINESSDAY:
      case GAMESTATE.ENDDAY:
        ctx.drawImage(this.background, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
        this.kitchen.draw(ctx);

        [
          ...this.popups,
          ...this.customers,
          ...this.thugs,
          ...this.bullets,
          ...this.coins
        ].forEach((object) => object.draw(ctx));

        this.clam.draw(ctx);
        this.gameStats.draw(ctx);
        break;

      case GAMESTATE.GAMEOVER:
        ctx.drawImage(this.background, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
        this.kitchen.draw(ctx);

        [
          ...this.customers,
          ...this.thugs,
          ...this.bullets,
          ...this.coins,
          ...this.popups
        ].forEach((object) => object.draw(ctx));
        this.customers.forEach((cust) => cust.draw(ctx));

        this.clam.draw(ctx);
        this.gameStats.draw(ctx);
        ctx.fillText("GAME OVER", this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2);

        break;

      case GAMESTATE.NIGHT:
        ctx.drawImage(this.night_bg, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

        ctx.drawImage(this.car, 600, 178);
        let objectstodraw = [
          this.kitchen,
          this.clam,
          this.gameStats,
          ...this.bullets,
          ...this.coins,
          ...this.popups
        ];
        objectstodraw.forEach((object) => object.draw(ctx));
        // Draw portals for buildings
        this.npcs.forEach((npc) => npc.draw(ctx));
        this.portals.forEach((object) => object.draw(ctx));
        this.checkTaxMan(ctx);

        break;

      case GAMESTATE.INHOOD_NIGHT:
        ctx.drawImage(this.hood_bg, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
        this.clam.draw(ctx);
        this.portals.forEach((object) => object.draw(ctx));
        this.gameStats.draw(ctx);
        break;

      case GAMESTATE.INHOOD_DAY:
        ctx.drawImage(
          this.hood_bg_day,
          0,
          0,
          this.GAME_WIDTH,
          this.GAME_HEIGHT
        );
        this.clam.draw(ctx);
        this.gameStats.draw(ctx);
        break;

      case GAMESTATE.INCITY1:
        ctx.drawImage(this.nighttown1, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
        ctx.drawImage(this.car, 1, 500);
        [
          ...this.popups,
          this.clam,
          ...this.portals,
          this.gameStats
        ].forEach((object) => object.draw(ctx));
        break;

      case GAMESTATE.INCITY2:
        ctx.drawImage(this.nighttown2, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
        ctx.drawImage(this.car, 1000, 520);
        [
          ...this.popups,
          this.clam,
          ...this.portals,
          this.gameStats
        ].forEach((object) => object.draw(ctx));
        break;

      case GAMESTATE.TAXHOUSE:
        ctx.drawImage(
          document.getElementById("taxroom"),
          0,
          0,
          this.GAME_WIDTH,
          this.GAME_HEIGHT
        );
        this.npcs.forEach((npc) => npc.draw(ctx));
        this.clam.draw(ctx);
        this.portals.forEach((object) => object.draw(ctx));
        ctx.fillText(
          "Taxes Paid - CLAM: " + this.gameStats.daysTaxPaid,
          500,
          400
        );

        this.checkTaxMan(ctx);
        this.gameStats.draw(ctx);

        break;

      case GAMESTATE.INHOME:
        ctx.drawImage(
          document.getElementById("room"),
          0,
          0,
          this.GAME_WIDTH,
          this.GAME_HEIGHT
        );
        // Draw square to represent bed
        ctx.drawImage(
          document.getElementById("bed"),
          this.GAME_WIDTH / 2,
          this.GAME_HEIGHT / 2,
          200,
          300
        );
        ctx.fillText(
          "START NEXT DAY",
          this.GAME_WIDTH / 2,
          this.GAME_HEIGHT / 2
        );

        this.clam.draw(ctx);
        this.portals.forEach((object) => object.draw(ctx));
        break;

      case GAMESTATE.UPGRADEROOM:
        ctx.drawImage(
          document.getElementById("upgrade_room"),
          0,
          0,
          this.GAME_WIDTH,
          this.GAME_HEIGHT
        );
        this.clam.draw(ctx);
        this.upgrades.forEach((object) => object.draw(ctx));
        this.portals.forEach((object) => object.draw(ctx));
        this.upgrades.forEach((upgradeobj) => {
          if (detectRectCollision(upgradeobj, this.clam)) {
            console.log("clam collide upgradobj");
            upgradeobj.onHover(ctx);
          }
        });
        this.gameStats.draw(ctx);
        break;

      case GAMESTATE.RESTO:
        ctx.drawImage(
          document.getElementById("restaurant"),
          0,
          0,
          this.GAME_WIDTH,
          this.GAME_HEIGHT
        );
        this.clam.draw(ctx);
        this.gameStats.draw(ctx);
        this.portals.forEach((object) => object.draw(ctx));
        break;

      case GAMESTATE.TUTORIAL:
        // Draw objects needed for tutorial
        ctx.drawImage(this.hood_bg, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
        [...this.bullets, ...this.popups].forEach((object) => object.draw(ctx));
        this.clam.draw(ctx);
        this.gameStats.draw(ctx);

        break;

      case GAMESTATE.NEXTLEVEL:
        ctx.drawImage(
          this.hood_bg_day,
          0,
          0,
          this.GAME_WIDTH,
          this.GAME_HEIGHT
        );
        [...this.bullets, ...this.popups].forEach((object) => object.draw(ctx));
        this.clam.draw(ctx);
        this.gameStats.draw(ctx);

        break;

      case GAMESTATE.MENU:
        ctx.drawImage(this.background, 0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
        ctx.font = "40px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";

        ctx.fillText(
          "Press SPACEBAR to start game",
          this.GAME_WIDTH / 2,
          this.GAME_HEIGHT / 2 + 50
        );
        break;

      default:
    }
  }

  // ------------------ MESSY HELPER FUNCTIONS ------------------

  eraseObjects() {
    this.bullets = [];
    this.coins = [];
    this.customers = [];
    this.kitchen.cooked_food = [];
    this.clam.bullets_held = [];
    this.popups = [];
    this.portals = [];
    this.npcs = [];
    this.thugs = [];
  }

  spacebarHandler() {
    // Actions for spacebar pressing to perform, based on gamestate
    document.addEventListener("keydown", (event) => {
      if (event.keyCode === 32) {
        switch (this.gamestate) {
          // ----- GAMESTATE = BUSINESSDAY -----
          case GAMESTATE.BUSINESSDAY:
            if (this.clam.bullets_held.length > 0) {
              this.bullets.push(
                new Food(this.clam.x_pos, this.clam.y_pos, this.clam.facing)
              );
              this.clam.bullets_held.shift(); // removes last item in array
              this.clam.shooting = true;
            }
            break;

          case GAMESTATE.MENU:
            this.goToGamestate(GAMESTATE.TUTORIAL);
            break;

          case GAMESTATE.ENDDAY:
            if (this.kitchen.cooked_food.length === 0) {
              this.goToGamestate(GAMESTATE.NIGHT);
            }
            break;

          case GAMESTATE.TAXHOUSE:
            this.payTaxMan();
            this.checkAndTriggerPortals(this.portals);
            break;

          case GAMESTATE.INHOME:
          case GAMESTATE.INCITY1:
          case GAMESTATE.INCITY2:
          case GAMESTATE.RESTO:
            this.checkAndTriggerPortals(this.portals);
            break;

          case GAMESTATE.NIGHT:
            this.payTaxMan();
            this.checkAndTriggerPortals(this.portals);
            break;

          case GAMESTATE.INHOOD_NIGHT:
          case GAMESTATE.NEXTLEVEL:
            this.popups = [];
            this.checkAndTriggerPortals(this.portals);
            break;

          case GAMESTATE.TUTORIAL:
            this.popups = [];
            this.goToGamestate(GAMESTATE.INHOOD_DAY);
            break;

          case GAMESTATE.UPGRADEROOM:
            this.checkAndTriggerPortals(this.portals);
            // Check interaction with upgrade stations
            this.upgrades.forEach((upgradeobj) => {
              if (detectRectCollision(upgradeobj, this.clam)) {
                console.log(upgradeobj);
                upgradeobj.upgrade();
              }
            });

            break;

          case GAMESTATE.GAMEOVER:
            this.eraseObjects();
            this.gameStats.gameOver();
            this.gamestate = GAMESTATE.MENU;

            break;

          default:
          //
        }
      }
    });
  }

  goToGamestate(gamestate) {
    console.log("GAMESTATE: " + this.gamestate);

    // ----- ACTIONS TO TRANSITION TO GAMESTATE.BUSINESSDAY -----
    if (gamestate === GAMESTATE.BUSINESSDAY) {
      if (
        this.gamestate === GAMESTATE.TUTORIAL ||
        this.gamestate === GAMESTATE.NEXTLEVEL ||
        this.gamestate === GAMESTATE.INHOOD_DAY
      ) {
        this.clam.x_pos = 1;
      }
      this.eraseObjects();
      this.popups = [];
      this.bullets = [];
      this.customers = [];
      this.coins = [];
      this.gamestate = GAMESTATE.BUSINESSDAY;
      initializeCooking(this.kitchen);
      initializeTimer(this.gameStats);

      initializeCustomers(this.gameStats);
      initializeThugs(this.gameStats);
    }

    if (gamestate === GAMESTATE.TUTORIAL) {
      this.gamestate = GAMESTATE.TUTORIAL;
      this.start();
      // push 1 food for tutorial purposes
      this.cookOneFood();
      this.popups.push(
        new TutorialPopup(
          this.GAME_WIDTH,
          this.GAME_HEIGHT,
          this.gameStats.business_day_timer,
          this.gameStats.days_tax
        )
      );
    }

    if (gamestate === GAMESTATE.ENDDAY) {
      this.kitchen.cooking = false;

      this.gameStats.timerOn = false;
      this.gameStats.custgen_on = false;
      this.gameStats.thuggen_on = false;

      this.gamestate = GAMESTATE.ENDDAY;
      this.popups.push(
        new EndDayPopup(
          this.GAME_WIDTH,
          this.GAME_HEIGHT,
          this.gameStats.days_fedcusts,
          this.gameStats.days_dollars,
          this.gameStats.days_tax
        )
      );
    }

    if (gamestate === GAMESTATE.NEXTLEVEL) {
      this.eraseObjects();
      this.gameStats.incrementLevel();
      this.gamestate = GAMESTATE.NEXTLEVEL;
      // throw new day popup
      this.popups.push(
        new BeginDayPopup(
          this.GAME_WIDTH,
          this.GAME_HEIGHT,
          this.gameStats.day,
          this.gameStats.business_day_timer,
          this.gameStats.days_tax
        )
      );
      this.cookOneFood();
    }

    if (gamestate === GAMESTATE.GAMEOVER) {
      this.gamestate = GAMESTATE.GAMEOVER;
      this.eraseObjects();
      this.kitchen.cooking = false;
      this.gameStats.timerOn = false;
    }

    // ----- ACTIONS TO TRANSITION TO GAMESTATE.NIGHT -----
    if (gamestate === GAMESTATE.NIGHT) {
      // if clam came from Tax House, place him at taxhouse portal
      if (this.gamestate === GAMESTATE.TAXHOUSE) {
        this.clam.x_pos = this.GAME_WIDTH / 2 + 10;
        this.clam.y_pos = this.GAME_HEIGHT - 150;
      } else if (this.gamestate === GAMESTATE.INHOOD_NIGHT) {
        this.clam.x_pos = 1;
      } else if (
        this.gamestate === GAMESTATE.INCITY1 ||
        this.gamestate === GAMESTATE.INCITY2
      ) {
        this.clam.x_pos = 638;
        this.clam.y_pos = 248;
      }
      this.eraseObjects();
      this.gameStats.resetLevel();

      this.gamestate = GAMESTATE.NIGHT;
      this.portals.push(new Portal(620, 255, GAMESTATE.INCITY1));
      this.npcs.push(new TaxMan(1000, 600, this.gameStats.days_tax));
    }

    if (gamestate === GAMESTATE.INCITY1) {
      if (this.gamestate === GAMESTATE.NIGHT) {
        this.clam.x_pos = 5;
        this.clam.y_pos = 550;
      } else if (this.gamestate === GAMESTATE.INCITY2) {
        this.clam.x_pos = this.GAME_WIDTH - this.clam.width;
      } else if (this.gamestate === GAMESTATE.UPGRADEROOM) {
        this.clam.x_pos = 445;
        this.clam.y_pos = 550;
      } else if (this.gamestate === GAMESTATE.RESTO) {
        this.clam.x_pos = 800;
        this.clam.y_pos = 550;
      }

      this.eraseObjects();
      this.gamestate = GAMESTATE.INCITY1;
      this.portals.push(new Portal(1, 570, GAMESTATE.NIGHT));
      this.portals.push(new Portal(400, 570, GAMESTATE.UPGRADEROOM));
      this.portals.push(new Portal(780, 570, GAMESTATE.RESTO));
    }

    if (gamestate === GAMESTATE.INCITY2) {
      if (this.gamestate === GAMESTATE.INCITY1) {
        this.clam.x_pos = 1;
      } else if (this.gamestate === GAMESTATE.TAXHOUSE) {
        this.clam.x_pos = 720;
        this.clam.y_pos = 580;
      }
      this.eraseObjects();
      this.gamestate = GAMESTATE.INCITY2;
      this.portals.push(new Portal(680, 590, GAMESTATE.TAXHOUSE));
      this.portals.push(new Portal(1000, 590, GAMESTATE.NIGHT));
    }

    if (gamestate === GAMESTATE.INHOOD_NIGHT) {
      if (this.gamestate === GAMESTATE.NIGHT) {
        this.clam.x_pos = this.GAME_WIDTH - this.clam.width;
      }
      this.eraseObjects();
      this.portals.push(new Portal(480, 440, GAMESTATE.NEXTLEVEL));
      this.gamestate = GAMESTATE.INHOOD_NIGHT;
    }

    if (gamestate === GAMESTATE.INHOOD_DAY) {
      this.eraseObjects();
      this.gamestate = GAMESTATE.INHOOD_DAY;
    }

    if (gamestate === GAMESTATE.TAXHOUSE) {
      this.eraseObjects();
      this.clam.x_pos = 60;
      this.clam.y_pos = 730;
      this.gamestate = GAMESTATE.TAXHOUSE;
      this.portals.push(new Portal(50, 730, GAMESTATE.INCITY2));
      this.npcs.push(new TaxMan(800, 665, this.gameStats.days_tax));
    }

    if (gamestate === GAMESTATE.INHOME) {
      this.eraseObjects();
      this.gamestate = GAMESTATE.INHOME;
      this.portals.push(
        new Portal(950, this.GAME_HEIGHT - 450, GAMESTATE.NIGHT)
      );
      this.portals.push(new Portal(600, 600, GAMESTATE.NEXTLEVEL));
      this.clam.x_pos = 1000;
      this.clam.y_pos = this.GAME_HEIGHT - 450;
    }

    if (gamestate === GAMESTATE.UPGRADEROOM) {
      this.eraseObjects();
      this.portals.push(new Portal(500, 742, GAMESTATE.INCITY1));
      this.gamestate = GAMESTATE.UPGRADEROOM;
      this.clam.x_pos = 540;
      this.clam.y_pos = 730;
    }

    if (gamestate === GAMESTATE.RESTO) {
      this.eraseObjects();
      this.portals.push(new Portal(1000, 657, GAMESTATE.INCITY1));
      this.gamestate = GAMESTATE.RESTO;
      this.clam.x_pos = 1040;
      this.clam.y_pos = 641;
    }
  }

  updateBullets(deltaTime) {
    //function to update bullets each loop
    this.bullets.forEach((bullet, index) => {
      for (var i = 0; i < this.customers.length; i++) {
        let thecustomer = this.customers[i];
        if (detectOverlapCollision(bullet, thecustomer)) {
          // trigger food being eaten process if food has not yet
          if (
            bullet.state === FOODSTATE.SERVED &&
            thecustomer.saturated === false
          ) {
            thecustomer.saturated = true;
            this.foodBeingEaten(bullet, thecustomer);
            bullet.state = FOODSTATE.BEINGEATEN;
          }
        }
      }

      bullet.update(deltaTime);
    });
  }

  // TODO: revise customer gen logic
  updateCustomers(deltaTime) {
    // Updating and drawing customers each frame
    this.customers.forEach((customer, index) => {
      customer.update(deltaTime);

      // Drop loot
      if (customer.hunger_points <= 0) {
        if (customer.state === CUSTSTATE.DROPPINGLOOT) {
          this.dropCoin(customer);
          this.gameStats.days_fedcusts++;
          customer.state = CUSTSTATE.EXITING;
        }
      }
      // Check collision with Bullets
      for (var i = 0; i < this.bullets.length; i++) {
        let thebullet = this.bullets[i];
        if (detectOverlapCollision(thebullet, customer)) {
          if (
            customer.state === CUSTSTATE.ACTIVE &&
            thebullet.state === FOODSTATE.SERVED
          ) {
            this.triggerCustEatingFood(customer, thebullet);
          }
        }
      }
    });
  }

  updateThugs(deltaTime) {
    let swingdelay = 200;
    this.thugs.forEach((thug) => {
      thug.update(this.gamestate);
      if (
        detectRectCollision(thug, this.clam) &&
        thug.attacking === false &&
        this.gamestate === GAMESTATE.BUSINESSDAY
      ) {
        thug.attacking = true;
        thug.state = THIEFSTATE.ATTACKING;
        thug.randomMovementOn = false;
        thug.prepAttack();
        setTimeout(function () {
          thug.img = thug.img_attack2;
        }, swingdelay);
        setTimeout(function () {
          thug.randomMovementOn = true;
          thug.attacking = false;
          thug.state = THIEFSTATE.WALKING;
        }, 1000);

        setTimeout(
          function (clam, gamestats) {
            if (clam.facing === -1) {
              clam.pushed_right = true;
            } else {
              clam.pushed_left = true;
            }
            gamestats.lives = gamestats.lives - 1;
          },
          swingdelay,
          this.clam,
          this.gameStats
        );
        console.log("clam and thug hit");
        console.log("Clam's lives left: " + this.gameStats.lives);
        if (this.gameStats.lives <= 0) {
          this.goToGamestate(GAMESTATE.GAMEOVER);
        }
      }
    });
  }

  updateCoins(coins) {
    coins.forEach((coin) => {
      if (detectCollision(coin, this.clam)) {
        coin.marked_for_deletion = true;
        // Accrue gameStats
        this.gameStats.dollars = this.gameStats.dollars + coin.value;
        this.gameStats.days_dollars = this.gameStats.days_dollars + coin.value;
      }
    });
  }

  checkAndTriggerPortals(portals) {
    // for each portal, if intersect with clam, go to portal.gamestate
    portals.forEach((portal) => {
      if (detectRectCollision(portal, this.clam)) {
        console.log(portal);
        this.goToGamestate(portal.getGamestate());
        console.log("entered: " + this.gamestate);
      }
    });
  }

  cookOneFood() {
    this.kitchen.cooked_food.push(
      new Food(
        this.kitchen.x_pos + 40,
        this.kitchen.y_pos + this.kitchen.truck_height - 80,
        1,
        FOODSTATE.INKITCHEN,
        this.kitchen
      )
    );
  }

  triggerCustEatingFood(customer, bullet) {
    // Actions for Customer to perform when they hit Food in game. Tried to refactor this to Cust object, coudln't get it to work.
    customer.state = CUSTSTATE.EATING;

    // Code to represent the customer "eating" the food
    let eat_interval = setInterval(takeBite, 750);
    function takeBite() {
      customer.hunger_points = customer.hunger_points - bullet.hunger_fill;

      if (customer.hunger_points <= 0) {
        clearInterval(eat_interval);
        console.log("Hunger depleted");
        customer.state = CUSTSTATE.DROPPINGLOOT;
      }
    }
  }

  // related to custEatingFood above
  dropCoin(customer) {
    // Function to make customer drop coin
    this.coins.push(
      new Coin(
        customer.x_pos + customer.width / 2,
        customer.y_pos + customer.height / 2,
        customer.drop_value
      )
    );
    console.log("dropCoin function activated");
  }

  // silly code to make food shrink when hit
  foodBeingEaten(bullet, customer) {
    var intervalId = setInterval(biteShrink, 300);
    function biteShrink() {
      const shrinkAmount = 10;
      bullet.size = bullet.size - shrinkAmount;
      bullet.x_pos = bullet.x_pos + shrinkAmount / 2;
      bullet.y_pos = bullet.y_pos + shrinkAmount / 2;

      if (
        customer.state === CUSTSTATE.DROPPINGLOOT ||
        customer.state === CUSTSTATE.EXITING
      ) {
        clearInterval(intervalId);
        bullet.marked_for_deletion = true;
      }
    }
  }

  // TODO: refactor out of gameManager. Maybe this can be a function in kitchen?
  checkClamGettingFood() {
    // Detect collision between clam and kitchen food
    this.kitchen.cooked_food.forEach((food, index) => {
      if (detectCollision(this.clam, food)) {
        food.marked_for_deletion = true;
        this.clam.newBullet();
      }
    });
  }

  checkTaxMan(ctx) {
    let taxguy = this.npcs[0];
    if (this.gameStats.daysTaxPaid === false) {
      if (detectRectCollision(this.clam, taxguy)) {
        taxguy.drawPopup(ctx);
      }
    }
  }

  payTaxMan() {
    let taxguy = this.npcs[0];
    if (
      this.gameStats.daysTaxPaid === false &&
      this.gameStats.dollars >= this.gameStats.days_tax
    ) {
      if (detectRectCollision(this.clam, taxguy)) {
        this.gameStats.daysTaxPaid = true;
        this.gameStats.dollars =
          this.gameStats.dollars - this.gameStats.days_tax;
      }
    }
  }
}

function initializeTimer(gameStats) {
  // if day timer is not on, turn on, and count down. If 0, end day
  if (gameStats.timerOn === false) {
    var startDayTimer = setInterval(incrementTime, gameStats.advance_interval);
    gameStats.timerOn = true;
    function incrementTime() {
      gameStats.business_day_timer--;
      // If timer ends, end business day functions
      if (gameStats.business_day_timer <= 0) {
        clearInterval(startDayTimer);
      }
    }
  }
}

function initializeThugRandomMovement(thug) {
  if (thug.randomMovementOn === false) {
    thug.randomMovementOn = true;
    var startRandomMovement = setInterval(
      randomizeDirection,
      thug.randomMovementInterval,
      thug
    );
    function randomizeDirection(thug) {
      if (thug.randomMovementOn === false) {
        clearInterval(startRandomMovement);
      }
      let randomInt = randomIntFromInterval(1, 6);
      // each roll outcome results in a different change in direction
      if (randomInt === 1) {
        thug.x_direction = 1;
        thug.state = THIEFSTATE.WALKING;
      } else if (randomInt === 2) {
        thug.x_direction = 0;
        if (thug.y_direction === 0) {
          thug.state = THIEFSTATE.STANDING;
        }
      } else if (randomInt === 3) {
        thug.x_direction = -1;
        thug.state = THIEFSTATE.WALKING;
      } else if (randomInt === 4) {
        thug.y_direction = 1;
        thug.state = THIEFSTATE.WALKING;
      } else if (randomInt === 5) {
        thug.y_direction = 0;
        if (thug.x_direction === 0) {
          thug.state = THIEFSTATE.STANDING;
        }
      } else if (randomInt === 6) {
        thug.y_direction = -1;
        thug.state = THIEFSTATE.WALKING;
      }
    }
  }
}

function initializeCustomers(gamestats) {
  if (gamestats.custgen_on === false) {
    var init_custs = setInterval(genCusts, gamestats.custgen_time);
    gamestats.custgen_on = true;
  }
  function genCusts() {
    if (gamestats.custgen_on === false) {
      clearInterval(init_custs);
    }

    if (gamestats.activecust_length <= gamestats.activecust_maxlength) {
      let rndInteger = randomIntFromInterval(1, 3);
      console.log(rndInteger);
      if (rndInteger === 1) {
        gamestats.custs.push(new Customer(1200, 800));
      } else if (rndInteger === 2) {
        gamestats.custs.push(new Customer(1200, 800));
        gamestats.custs.push(new Customer(1200, 800));
      } else {
        // no spawn
      }
    }
  }
}

function initializeThugs(gamestats) {
  if (gamestats.thuggen_on === false) {
    var init_thugs = setInterval(
      genThugs,
      gamestats.thuggen_time,
      gamestats.thuggen_time
    );
    gamestats.thuggen_on = true;
  }
  function genThugs(time) {
    if (gamestats.thuggen_on === false) {
      clearInterval(init_thugs);
    }
    if (gamestats.activethug_length <= gamestats.activethug_maxlength) {
      let rndInteger = randomIntFromInterval(1, 2);
      console.log("thug roll: " + rndInteger);
      console.log("thuggen time" + gamestats.thuggen_time);
      if (rndInteger === 1) {
        gamestats.thugs.push(new Thug(1200, 800));
      } else {
        //nospawn
      }
    }
  }
}

// intitialize cooking TODO: Clean up
function initializeCooking(kitchen) {
  if (kitchen.cooking === false) {
    var kitchenCooking = setInterval(cookFood, kitchen.cook_time);
    kitchen.cooking = true;
  }

  // cookfood interval function
  function cookFood() {
    // Cook a food bullet into the kitchen if space is available

    // if this.cooking is false, then stop the kitchen cooking interval loop
    if (kitchen.cooking === false) {
      clearInterval(kitchenCooking);
    }

    if (kitchen.cooked_food.length < kitchen.max_food) {
      // Generate random y point within food truck window
      this.rndBinary = randomIntFromInterval(
        kitchen.y_pos + kitchen.truck_height * (2 / 5), // top of truck window
        kitchen.y_pos + kitchen.truck_height * (3 / 5) - 5 // bottom of truck window
      );

      kitchen.cooked_food.push(
        // push new food item to food truck
        new Food(
          kitchen.x_pos + 30,
          this.rndBinary,
          1,
          FOODSTATE.INKITCHEN,
          this.kitchen
        )
      );
    } else {
    }
  }
}

/* THIS FUNCTION IN THE GameManager class does not work: the gameStats.business_day_timer only increments one time and stops
  initializeTimer() {
    // if day timer is not on, turn on, and count down. If 0, clear timer
    var startDayTimer = setInterval(
      incrementTime(this.gameStats),
      this.gameStats.advance_interval
    );
    function incrementTime(stats) {
      stats.business_day_timer--;
      // If timer ends, end business day functions
      if (stats.business_day_timer <= 0) {
        clearInterval(startDayTimer);
      }
      return stats.business_day_timer
    }
  }
  */

/*
  clickToChangeGamestate(object, gamestate) {
    document.addEventListener("click", (event) => {
      let rect = this.ctx.getBoundingClientRect();
      this.click.x = event.clientX - rect.left;
      this.click.y = event.clientY - rect.top;
      console.log(this.click);
    });
    if (this.isIntersect(this.click, object)) {
      this.gamestate = gamestate;
    }
  }

  isIntersect(point, object) {
    if (point.x > object.x_pos && point.x < object.x_pos + object.height) {
      return true;
    } else {
      return false;
    }
  }
*/
/*
  generateCustomers() {
    // reload customers array (temporary code, will flesh out cust gen)
    if (this.customers.length < 4) {
      this.customers.push(new Customer(this.GAME_WIDTH, this.GAME_HEIGHT));
    }
  }

  generateThugs() {
    if (this.thugs.length < 1) {
      this.thugs.push(new Thug(this.GAME_WIDTH, this.GAME_HEIGHT));
      console.log(this.thugs);
    }
  }
  */
