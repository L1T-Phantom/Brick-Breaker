var paddle, padleanim, bulletPanim;

var ball, ballimg;

var start, startImg;
var restart, restartImg;

var serve, play, end;
var gamestate = "serve";

var tile;
var rand;

var tilegroup;
var bulletG, bulletG2;

var tileimg1;
var tileimg2;
var tileimg3;
var tileimg4;
var tileimg5;
var tileimg6;
var tileimg7;
var tileimg8;
var tileimg9;
var tileimg10;

var Pop;

var bulletPower, bulletPowerImg;
var bullet1, bulletImg;

var extendPower, extendPowerImg;

var firePower, firePowerImg;

var life, lifeImg;

var score, lives;

function preload() {
  bg = loadImage("Images/bg.png");

  startImg = loadImage("Images/start.png");
  restartImg = loadImage("Images/restart.png");

  paddleanim = loadAnimation(
    "Images/NormalPaddle/paddle1.png",
    "Images/NormalPaddle/paddle2.png",
    "Images/NormalPaddle/paddle3.png"
  );

  bulletPanim = loadAnimation(
    "Images/BulletPaddle/bulletP1.png",
    "Images/BulletPaddle/bulletP2.png",
    "Images/BulletPaddle/bulletP3.png"
  );

  extendPanim = loadAnimation("Images/extendPaddle.png");

  ballimg = loadImage("Images/ball.png");

  lifeImg = loadImage("Images/life.png");

  tileimg1 = loadImage("Images/tiles/tile1.png");
  tileimg2 = loadImage("Images/tiles/tile2.png");
  tileimg3 = loadImage("Images/tiles/tile3.png");
  tileimg4 = loadImage("Images/tiles/tile4.png");
  tileimg5 = loadImage("Images/tiles/tile5.png");
  tileimg6 = loadImage("Images/tiles/tile6.png");
  tileimg7 = loadImage("Images/tiles/tile7.png");
  tileimg8 = loadImage("Images/tiles/tile8.png");
  tileimg9 = loadImage("Images/tiles/tile9.png");
  tileimg10 = loadImage("Images/tiles/tile10.png");

  bulletPowerImg = loadImage("Images/power-ups/bulletpower.png");
  bulletImg = loadImage("Images/bullet.png");

  extendPowerImg = loadImage("Images/power-ups/extendpower.png");

  firePowerImg = loadImage("Images/power-ups/firepower.png");
  fireBall = loadAnimation(
    "Images/Fireball/fireball.png",
    "Images/Fireball/fireball1.png",
    "Images/Fireball/fireball.png"
  );

  Pop = loadSound("Audio/pop.mp3");
  Bullet = loadSound("Audio/laser.mp3");
}

function setup() {
  var canvas = createCanvas(windowWidth - 20, windowHeight - 20);

  score = 0;
  lives = 3;

  life = createSprite(40, 40);
  life.addImage(lifeImg);
  life.scale = 0.4;

  start = createSprite(width / 2, height / 2 + 100);
  start.addImage(startImg);
  start.scale = 0.7;
  start.visible = true;

  restart = createSprite(width / 2, height / 2 + 100);
  restart.addImage(restartImg);
  restart.scale = 0.7;
  restart.visible = false;

  paddle = createSprite(width / 2, height - 40);
  paddle.addAnimation("normal", paddleanim);
  paddle.addAnimation("bullet", bulletPanim);
  paddle.addAnimation("extend", extendPanim);
  paddle.scale = 0.3;

  ball = createSprite(width / 2, height / 2);
  ball.addImage(ballimg);
  ball.scale = 0.2;

  tilegroup = new Group();
  bulletG = new Group();
  extendG = new Group();
  fireG = new Group();
  fireG2 = new Group();
  bulletG2 = new Group();

  tilespawn();
}

function draw() {
  background(bg);

  if (gamestate === "serve") {
    start.visible = true;
    restart.visible = false;

    if (mousePressedOver(start) || touches.length > 0) {
      touches = [];
      gamestate = "play";
      ball.velocityX = -15;
      ball.velocityY = 10;
    }
  }

  if (gamestate === "play") {
    start.visible = false;
    restart.visible = false;
    paddle.x = mouseX;

    if (ball.isTouching(paddle)) {
      ball.y = ball.y - 5;
      ball.velocityY = -ball.velocityY;
    }

    if (ball.y <= 0) {
      ball.velocityY = -ball.velocityY;
    }

    if (ball.x <= 0) {
      ball.velocityX = -ball.velocityX;
    }

    if (ball.x >= windowWidth) {
      ball.velocityX = -ball.velocityX;
    }

    for (var i = 0; i < tilegroup.length; i++) {
      if (tilegroup.get(i) != null && ball.isTouching(tilegroup.get(i))) {
        tilegroup.get(i).destroy();
        ball.velocityY = -ball.velocityY;
        Pop.play();
        score += 10;
      }
    }

    for (var i = 0; i < tilegroup.length; i++) {
      for (var j = 0; j < fireG2.length; j++) {
        if (tilegroup.get(i) != null && fireG2.isTouching(tilegroup.get(i))) {
          tilegroup.get(i).destroy();
          Pop.play();
          score += 10;
        }
      }
    }

    for (var i = 0; i < tilegroup.length; i++) {
      for (var j = 0; j < bulletG2.length; j++) {
        if (tilegroup.get(i) != null && bulletG2.isTouching(tilegroup.get(i))) {
          tilegroup.get(i).destroy();
          bulletG2.get(j).destroy();
          Pop.play();
          score += 10;
        }
      }
    }

    for (var i = 0; i < fireG.length; i++) {
      if (fireG.get(i) != null && paddle.isTouching(fireG.get(i))) {
        fireG.get(i).destroy();
        paddle.changeAnimation("bullet", bulletPanim);
        setTimeout(actualAnimation, 2000);
        shootFire();
      }
    }

    for (var i = 0; i < extendG.length; i++) {
      if (extendG.get(i) != null && paddle.isTouching(extendG.get(i))) {
        extendG.get(i).destroy();
        paddle.changeAnimation("extend", extendPanim);
        setTimeout(actualAnimation, 6000);
      }
    }

    for (var i = 0; i < bulletG.length; i++) {
      if (bulletG.get(i) != null && paddle.isTouching(bulletG.get(i))) {
        bulletG.get(i).destroy();
        paddle.changeAnimation("bullet", bulletPanim);
        setTimeout(actualAnimation, 2000);
        fireBullet();
        Bullet.play();
      }
    }

    if (ball.y >= windowHeight + 5 && ball.y <= windowHeight + 20) {
      lives--;
      ball.x = width / 2;
      ball.y = height / 2;
      if (lives === 0) {
        gamestate = "end";
      }
    }

    for (var i = 0; i < tilegroup.length; i++) {
      if (tilegroup.get(i) != null && tilegroup.get(i).y >= windowHeight) {
        gamestate = "end";
        lives = 0;
      }
    }

    extendpower();
    bulletpower();
    firepower();
    addBricks();
  } else if (gamestate === "end") {
    reset();
  }

  drawSprites();

  fill("white");
  textSize(32);
  text("Score: " + score, windowWidth - 300, 50);
  text(lives, 80, 50);
}

function reset() {
  restart.visible = true;
  if (mousePressedOver(restart) || touches.length > 0) {
    touches = [];
    gamestate = "play";
    ball.x = width / 2;
    ball.y = height / 2;
    ball.velocityX = -15;
    ball.velocityY = 16;
    tilegroup.destroyEach();
    tilespawn();
    paddle.changeAnimation("normal", padleanim);
    lives = 3;
    score = 0;
  }
}

function actualAnimation() {
  paddle.changeAnimation("normal", paddleanim);
}

function tilespawn() {
  for (var x = 52.5; x < windowWidth; x = x + windowWidth / 13) {
    for (var y = 100; y <= 250; y = y + 50) {
      tile = createSprite(x, y);
      tile.scale = 0.25;
      tilegroup.add(tile);
      rand = Math.round(random(1, 10));
      switch (rand) {
        case 1:
          tile.addImage(tileimg1);
          break;
        case 2:
          tile.addImage(tileimg2);
          break;
        case 3:
          tile.addImage(tileimg3);
          break;
        case 4:
          tile.addImage(tileimg4);
          break;
        case 5:
          tile.addImage(tileimg5);
          break;
        case 6:
          tile.addImage(tileimg6);
          break;
        case 7:
          tile.addImage(tileimg7);
          break;
        case 8:
          tile.addImage(tileimg8);
          break;
        case 9:
          tile.addImage(tileimg9);
          break;
        case 10:
          tile.addImage(tileimg10);
          break;
        default:
          break;
      }
    }
  }
}

function shootFire() {
  bullet1 = createSprite(paddle.x - paddle.width / 2, windowHeight - 35);
  bullet1.addAnimation("s", fireBall);
  bullet1.scale = 0.8;
  bullet1.velocityY = -12;
  bullet2 = createSprite(paddle.x + paddle.width / 2, windowHeight - 35);
  bullet2.addAnimation("s", fireBall);
  bullet2.scale = 0.8;
  bullet2.velocityY = -12;
  fireG2.add(bullet1);
  fireG2.add(bullet2);
  bulletG2.setLifeTimeEach = windowHeight / 12;
}

function fireBullet() {
  bullet1 = createSprite(paddle.x - paddle.width / 2, windowHeight - 35);
  bullet1.addImage(bulletImg);
  bullet1.scale = 0.8;
  bullet1.velocityY = -12;
  bullet2 = createSprite(paddle.x + paddle.width / 2, windowHeight - 35);
  bullet2.addImage(bulletImg);
  bullet2.scale = 0.8;
  bullet2.velocityY = -12;
  bulletG2.add(bullet1);
  bulletG2.add(bullet2);
  bulletG2.setLifeTimeEach = windowHeight / 12;
}

function firepower() {
  if (frameCount % 450 === 0) {
    rand = Math.round(random(10, windowWidth - 10));
    firePower = createSprite(rand, 0);
    firePower.addImage(firePowerImg);
    firePower.scale = 0.2;
    firePower.velocityY += 6;
    fireG.add(firePower);
  }
}

function bulletpower() {
  if (frameCount % 350 === 0) {
    rand = Math.round(random(10, windowWidth - 10));
    bulletPower = createSprite(rand, 0);
    bulletPower.addImage(bulletPowerImg);
    bulletPower.scale = 0.2;
    bulletPower.velocityY += 6;
    bulletG.add(bulletPower);
  }
}

function extendpower() {
  if (frameCount % 250 === 0) {
    rand = Math.round(random(10, windowWidth - 10));
    extendPower = createSprite(rand, 0);
    extendPower.addImage(extendPowerImg);
    extendPower.scale = 0.2;
    extendPower.velocityY += 6;
    extendG.add(extendPower);
  }
}

function mouseDragged() {
  paddle.x = mouseX;
}

function addBricks() {
  for (var i = 0; i < tilegroup.length; i++) {
    if (tilegroup.get(i) != null && frameCount % 250 === 0) {
      tilegroup.get(i).y = tilegroup.get(i).y + 50;
    }
  }
  if (frameCount % 250 === 0) {
    for (var x = 52.5; x < windowWidth; x = x + windowWidth / 13) {
      tile = createSprite(x, 100);
      tile.scale = 0.25;
      tilegroup.add(tile);
      rand = Math.round(random(1, 10));
      switch (rand) {
        case 1:
          tile.addImage(tileimg1);
          break;
        case 2:
          tile.addImage(tileimg2);
          break;
        case 3:
          tile.addImage(tileimg3);
          break;
        case 4:
          tile.addImage(tileimg4);
          break;
        case 5:
          tile.addImage(tileimg5);
          break;
        case 6:
          tile.addImage(tileimg6);
          break;
        case 7:
          tile.addImage(tileimg7);
          break;
        case 8:
          tile.addImage(tileimg8);
          break;
        case 9:
          tile.addImage(tileimg9);
          break;
        case 10:
          tile.addImage(tileimg10);
          break;
        default:
          break;
      }
    }
  }
}
