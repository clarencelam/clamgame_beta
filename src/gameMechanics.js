// function detectCollision returns true if bullet is within object
export function detectCollision(bullet, object) {
  let topOfBullet = bullet.y_pos;
  let bottomOfBullet = bullet.y_pos + bullet.size;
  let leftOfBullet = bullet.x_pos;
  let rightOfBullet = bullet.x_pos + bullet.size;

  let topOfObject = object.y_pos;
  let bottomOfObject = object.y_pos + object.size;
  let leftOfObject = object.x_pos;
  let rightOfObject = object.x_pos + object.size;

  if (
    bottomOfBullet > topOfObject && // bottom of bullet is under the top of obj
    topOfBullet < bottomOfObject &&
    rightOfBullet > leftOfObject &&
    leftOfBullet < rightOfObject
  ) {
    return true;
  } else {
    return false;
  }
}

export function detectOverlapCollision(bullet, object) {
  let topOfBullet = bullet.y_pos;
  let bottomOfBullet = bullet.y_pos + bullet.size;
  let leftOfBullet = bullet.x_pos;
  let rightOfBullet = bullet.x_pos + bullet.size;
  let middleOfBullet = bullet.x_pos + bullet.size / 2;

  let topOfObject = object.y_pos;
  let bottomOfObject = object.y_pos + object.height;
  let leftOfObject = object.x_pos;
  let rightOfObject = object.x_pos + object.width;

  if (
    bottomOfBullet > topOfObject && // bottom of bullet is under the top of obj
    topOfBullet < bottomOfObject &&
    middleOfBullet > leftOfObject &&
    middleOfBullet < rightOfObject
  ) {
    return true;
  } else {
    return false;
  }
}

export function detectRectCollision(objectone, objecttwo) {
  let topOfBullet = objectone.y_pos;
  let bottomOfBullet = objectone.y_pos + objectone.height;
  let leftOfBullet = objectone.x_pos;
  let rightOfBullet = objectone.x_pos + objectone.width;

  let topOfObject = objecttwo.y_pos;
  let bottomOfObject = objecttwo.y_pos + objecttwo.height;
  let leftOfObject = objecttwo.x_pos;
  let rightOfObject = objecttwo.x_pos + objecttwo.width;

  if (
    bottomOfBullet > topOfObject && // bottom of bullet is under the top of obj
    topOfBullet < bottomOfObject &&
    rightOfBullet > leftOfObject &&
    leftOfBullet < rightOfObject
  ) {
    return true;
  } else {
    return false;
  }
}

export function foodShrink(bullet) {
  const biteSize = 10;
  bullet.size = bullet.size - biteSize;
  bullet.x_pos = bullet.x_pos + biteSize / 2;
  bullet.y_pos = bullet.y_pos + biteSize / 2;
}

export function incrementalAction(funct, millisec, terminate_function) {
  var intervalId = setInterval(funct, millisec);
  if (terminate_function) {
    clearInterval(intervalId);
  }
}

export function eatFood(customer, bullet) {
  customer.hungerpoints = customer.hunger_points - bullet.hunger_fill;
}

export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
