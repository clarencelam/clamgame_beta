import GameManager from "./gameManager";

// -------------- INITIALIZE GAME OBJECTS ----------------
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;
let canvas = document.getElementById("canvas1");
let ctx = canvas.getContext("2d");
canvas.height = GAME_HEIGHT;
canvas.width = GAME_WIDTH;

let lastTime = 0;
let fpsInterval = 10; // one frame per X milliseconds

let game = new GameManager(GAME_WIDTH, GAME_HEIGHT, canvas);

// --------------- MAIN GAMELOOP --------------------------

function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  if (deltaTime < fpsInterval) {
    // fps interval is not yet met-- do nothing;
  } else {
    // fps interval is met -- update game frames
    lastTime = timestamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    game.update(deltaTime);
    game.draw(ctx);
  }
  requestAnimationFrame(gameLoop);
}

// ----------------------- RUN GAMELOOP -----------------------------
gameLoop();

//
//
//
// ----------------- DEPRECATED INDEX.JS CODE IN CASE I'LL NEED IT AGAIN  --------------------------

// --------------- IF GAME IS ACTIVE --------------------------
/*
    if (gameStats.game_active === true) {
      // update and draw kitchen objects
      ctx.drawImage(background, 0, 0, GAME_WIDTH, GAME_HEIGHT);

      kitchen.update();
      kitchen.draw(ctx);

      if (
        // if level start window is active and has not been triggered, add the start window popup to popups array
        gameStats.show_lvlstart_window === true &&
        gameStats.triggered_lvlstart_window === false
      ) {
        initializeLevelStartPopup();
      }

      // --------------- IF BUSINESS DAY IS ACTIVE --------------------------

      if (gameStats.business_day_active === true) {
        // Game actions only to occur if business day is active

        // Perform the kitchen cooking loop
        initializeKitchen(kitchen);
        initializeTimer();

        // update and draw customer objects
        customers = customers.filter((customer) => !customer.markfordelete);
        updateCustomers(customers, deltaTime);
      }
      // --------------- END IF BUSINESS DAY IS ACTIVE --------------------------

      // check if clam is over a food
      checkClamGettingFood();

      //update and draw coin objects
      coins = coins.filter((coin) => !coin.marked_for_deletion);

      coins.forEach((coin, index) => {
        if (detectCollision(coin, clam)) {
          coin.marked_for_deletion = true;
          // Accrue gameStats
          gameStats.dollars = gameStats.dollars + coin.value;
          gameStats.days_dollars = gameStats.days_dollars + coin.value;
        }
        coin.draw(ctx);
        console.log("drawing coins");
      });

      // update and draw bullets
      bullets = bullets.filter((bullet) => !bullet.marked_for_deletion);
      updateBullets(bullets, deltaTime);

      // update and draw clam character
      clam.update(deltaTime);
      clam.draw(ctx);

      // draw popup boxes
      popups.forEach((popup) => {
        popup.draw(ctx);
      });

      // update and draw game score, lives, other stats
      gameStats.draw(ctx);
    }
    // --------------- END OF (IF GAME IS ACTIVE) --------------------------
    
    */

// ----------------- HELPER FUNCTIONS --------------------------

/*

export function spacebarTrigger() {
  // Perform activites for when spacebar is pressed
  while (true) {
    // if levelstart popup window is present, pressing space bar will start level
    if (gameStats.show_lvlstart_window === true) {
      startBusinessDay();
      gameStats.show_lvlstart_window = false;
      break;
    }

    if (gameStats.taxPaidSuccessfully === true) {
      // if tax is paid and spacebar is pressed, proceed to night time
      startNightTime();
      gameStats.taxPaidSuccessfully = false;
      break;
    }

    if (gameStats.night_time_active === true) {
      // If nighttime is active and spacebar is pressed, go to next day
      gameStats.show_lvlstart_window = true;
      gameStats.night_time_active = false;
      console.log("close night time, trigger next day");
      break;
    }

    if (gameStats.dollars < 0) {
      // If user is on fail-game popup window "press spacebar to restart"
      hitBankrupcy();
      popups = [];
      gameStats.timeToRestart = false;
      break;
    }

    if (gameStats.show_lvlend_window === true) {
      // If level end window is showing and spacebar is pressed, clear popups and start nightime
      gameStats.show_lvlend_window = false;
      popups = [];
      console.log("close level end window, activate night");
      console.log(gameStats.show_lvlstart_window);
      payTax();
      break;
    }

    // if clam bullet length > 0, fire bullet
    if (clam.bullets_held.length > 0) {
      bullets.push(new Food(clam.x_pos, clam.y_pos, clam.facing));
      clam.bullets_held.shift(); // removes last item in array
      break;
    }
  }
}

function startBusinessDay() {
  //actions to take when level is started
  gameStats.triggered_lvlstart_window = false;
  popups = [];
  gameStats.business_day_active = true;
}

function startNightTime() {
  // actions to take when night time is started
  popups = [];
  gameStats.night_time_active = true;
  gameStats.incrementLevel();
}

function payTax() {
  // Pay tax after business day ends, continue or end game
  gameStats.dollars = gameStats.dollars - gameStats.days_tax;
  if (gameStats.dollars >= 0) {
    var msg1 =
      "You successfully paid the day's tax & now have " +
      gameStats.dollars +
      " coins";
    var msg2 = "Press SPACEBAR to continue to night time";
    popups.push(new TwoLinePopup(GAME_WIDTH / 2, GAME_HEIGHT / 2, msg1, msg2));
    gameStats.taxPaidSuccessfully = true; // flag for spacebar action
  } else {
    var msg1 =
      "You were not able to pay the day's tax, and have gone bankrupt.";
    var msg2 = "Press SPACEBAR to continue.";
    popups.push(new TwoLinePopup(GAME_WIDTH / 2, GAME_HEIGHT / 2, msg1, msg2));
  }
}

function hitBankrupcy() {
  gameStats.gameOver();
  gameStats.game_active = true;
  gameStats.show_lvlstart_window = true;
  console.log("hitBankrupcy() triggered, game over");
}

function initializeLevelStartPopup() {
  // actions to take when level is started but the popup is not initialized
  gameStats.triggered_lvlstart_window = true;
  popups.push(
    new BeginDayPopup(
      GAME_WIDTH,
      GAME_HEIGHT,
      gameStats.day,
      gameStats.business_day_timer,
      gameStats.days_tax
    )
  );
}

function initializeTimer() {
  // if day timer is not on, turn on, and count down. If 0, end day
  if (gameStats.timerOn === false) {
    var startDayTimer = setInterval(incrementTime, gameStats.advance_interval);
    function incrementTime() {
      gameStats.business_day_timer--;
      // If timer ends, end business day functions
      if (gameStats.business_day_timer <= 0) {
        endBusinessDay();
        clearInterval(startDayTimer);
      }
    }
    gameStats.timerOn = true;
  }
}

function endBusinessDay() {
  // END OF BUSINESS DAY BEHAVIORS
  gameStats.business_day_active = false;
  kitchen.cooking = false;
  popups.push(
    new EndDayPopup(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      gameStats.days_fedcusts,
      gameStats.days_dollars,
      gameStats.days_tax
    )
  );
  gameStats.show_lvlend_window = true;
  gameStats.resetLevel();
}

function checkClamGettingFood() {
  // Detect collision between clam and kitchen food
  kitchen.cooked_food.forEach((food, index) => {
    if (detectCollision(clam, food)) {
      food.marked_for_deletion = true;
      clam.bullets_held.push(new FoodSprite(clam.x_pos, clam.y_pos));
    }
  });
}

function initializeKitchen(kitchen) {
  // Start kitchen and begin cooking food
  if (kitchen.cooking === false) {
    var kitchenCooking = setInterval(cookFood, kitchen.cook_time);
    kitchen.cooking = true;
  }
  function cookFood() {
    // Cook a food bullet into the kitchen if space is available

    if (kitchen.cooked_food.length < kitchen.max_food) {
      // Generate random y point within food truck window
      this.rndBinary = randomIntFromInterval(
        kitchen.y_pos + kitchen.truck_height * (2 / 5), // top of truck window
        kitchen.y_pos + kitchen.truck_height * (3 / 5) - 5 // bottom of truck window
      );

      kitchen.cooked_food.push(
        // push new food item to food truck
        new Food(kitchen.x_pos + 30, this.rndBinary, 1, true, this.kitchen)
      );
    }

    if (kitchen.cooking === false) {
      clearInterval(kitchenCooking);
    }
  }
}

function updateBullets(bullets, deltaTime) {
  //function to update bullets each loop
  bullets.forEach((bullet, index) => {
    customers.forEach((customer, index) => {
      if (detectOverlapCollision(bullet, customer)) {
        // if bullets are colliding:
        // trigger customer eating process if customer has not yet begun
        if (customer.hit === false) {
          custEatingFood(bullet, customer, coins);
        }
        // trigger food being eaten process if food has not yet
        if (bullet.food_hit === false) {
          foodBeingEaten(bullet, customer);
        }
      }
    });
    // Detect collision between bullet and clam
    if (detectCollision(bullet, clam) && bullet.pickupable === true) {
      clam.bullets_held.push(new FoodSprite(clam.x_pos, clam.y_pos));
      bullet.marked_for_deletion = true;
    }

    bullet.update(deltaTime);
    bullet.draw(ctx);
  });
}

function dropCoin(customer, coins) {
  // Function to make customer drop coin
  coins.push(
    new Coin(
      customer.x_pos + customer.width / 2,
      customer.y_pos + customer.height / 2
    )
  );
  console.log("dropCoin function activated");
  console.log(coins);
}

function updateCustomers(customers, deltaTime) {
  // Updating and drawing customers each frame
  customers.forEach((customer, index) => {
    customer.update(deltaTime);
    customer.draw(ctx);
  });
  // reload customers array (temporary code, will flesh out cust gen)
  if (customers.length < 3) {
    customers.push(new Customer(GAME_HEIGHT, GAME_WIDTH));
  }
}

function custEatingFood(bullet, customer, coins) {
  // Actions for Customer to perform when they hit Food in game
  customer.hit = true;
  customer.hitFood(bullet);

  // Code to represent the customer "eating" the food
  var eatTime = setInterval(custEat, 750);
  function custEat() {
    const fill_points = 1;
    customer.hunger_points = customer.hunger_points - fill_points;

    if (customer.hunger_points <= 0) {
      // drop coin if customer hasnt yet
      if (customer.done_dropping_coin === false) {
        dropCoin(customer, coins);
        customer.done_dropping_coin = true;
      }

      clearInterval(eatTime);
      // accrue GameStats stats
      gameStats.days_fedcusts++;
    }
  }
}

function foodBeingEaten(bullet, customer) {
  bullet.food_hit = true;
  bullet.hitCustomer(customer);

  var intervalId = setInterval(biteShrink, 750);

  function biteShrink() {
    const shrinkAmount = 25;
    bullet.size = bullet.size - shrinkAmount;
    bullet.x_pos = bullet.x_pos + shrinkAmount / 2;
    bullet.y_pos = bullet.y_pos + shrinkAmount / 2;

    if (bullet.size <= 0) {
      clearInterval(intervalId);
    }
  }
}

*/
