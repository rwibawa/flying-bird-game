import { sound } from "./lib/sound.js";

var myGamePiece;
var myObstacles = [];
var myScore;
var myBackground;
var mySound;
var myMusic;

export function startGame() {
  myGameArea.start();

  myGamePiece = new component(30, 30, "../resources/img/smiley.gif", 10, 120, "image", 0.05);
  myBackground = new component(656, 270, "../resources/img/citymarket.jpg", 0, 0, "background");
  
  // Moving Background to the left
  myBackground.speedX = -1;

  myScore = new component("30px", "Consolos", "black", 280, 40, "text");
  mySound = new sound("../resources/audio/bounce.mp3");
  myMusic = new sound("../resources/audio/gametheme.mp3");
  myMusic.play();
}

// Attach an event, and call startGame when the document is done loading.
// document.addEventListener("DOMContentLoaded", startGame);

const myGameArea = {
  canvas: document.createElement("canvas"),
  keys: {},

  start: function() {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");

    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);  // 50 Hz

    this.frameNo = 0;

    // Keyboard as Controller
    window.addEventListener('keydown', (e) => {
      // Multiple Keys Pressed
      myGameArea.keys[e.keyCode] = true;
    });

    window.addEventListener('keyup', (e) => {
      // Multiple Keys Unpressed
      delete myGameArea.keys[e.keyCode];
    });
    
  },

  clear: function() {
    this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
  },
  
  stop : function() {
    clearInterval(this.interval);
  }
}

function component(width, height, color, x, y, type, gravity = 0) {
  this.type = type;
  if (type === "image" || type === "background") {
    this.image = new Image();
    this.image.src = color;
  }

  this.width = width;
  this.height = height;
  
  this.x = x;
  this.y = y;
  
  this.speedX = 0;
  this.speedY = 0;

  this.initialGravity = gravity;
  this.gravity = gravity;
  this.gravitySpeed = 0;

  this.update = function() {
    const ctx = myGameArea.context;
    ctx.fillStyle = color;
    
    if (this.type === "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillText(this.text, this.x, this.y);
      return;
    }

    if (this.type === "image" || this.type === "background") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

      if (this.type === "background") {
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
      }

      return;
    }

    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  this.newPos = function() {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;

    if (this.type === "background" && this.x == -this.width) {
      this.x = 0;
    }
    
    if (this.gravity > 0) {
      this.hitBottom();
    }
  }

  this.hitBottom = function() {
    var rockbottom = myGameArea.canvas.height - this.height;
    if (this.y > rockbottom) {
      this.y = rockbottom;
      this.gravitySpeed = 0;
      this.gravity = 0;
    }
  }

  this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    
    if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) 
    {
      crash = false;
    }

    return crash;
  }

  this.clearMove = function () {
    this.speedX = 0;
    this.speedY = 0;
    this.image.src = "../resources/img/smiley.gif";
  }

  this.move = function () {
    if (Object.keys(myGameArea.keys).length == 0) {
      return;
    }

    this.image.src = "../resources/img/angry.gif";

    // Multiple Keys Pressed
    if (myGameArea.keys[37]) { myGamePiece.speedX = -1; }
    if (myGameArea.keys[39]) { myGamePiece.speedX = 1; }
    if (myGameArea.keys[38]) { myGamePiece.speedY = -1; }
    if (myGameArea.keys[40]) { myGamePiece.speedY = 1; }
  }
}

function updateGameArea() {
  var x, height, gap, minHeight, maxHeight, minGap, maxGap;
  
  for (let i = 0; i < myObstacles.length; i += 1) {
      if (myGamePiece.crashWith(myObstacles[i])) {
          mySound.play();
          myGameArea.stop();
          return;
      } 
  }

  myGameArea.clear();
  myGamePiece.clearMove();
  myGamePiece.move();

  myBackground.newPos();    
  myBackground.update();

  // We use the frameNo property to count the score:
  myGameArea.frameNo++;

  if (myGameArea.frameNo == 1 || everyinterval(150)) {
      x = myGameArea.canvas.width;
      minHeight = 20;
      maxHeight = 200;
      height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
      minGap = 50;
      maxGap = 200;
      gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
      myObstacles.push(new component(10, height, "green", x, 0));
      myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
  }
  
  for (let i = 0; i < myObstacles.length; i++) {
      myObstacles[i].speedX = -1;
      myObstacles[i].newPos();
      myObstacles[i].update();
  }

  myScore.text = "SCORE: " + myGameArea.frameNo;
  myScore.update();

  myGamePiece.newPos();
  myGamePiece.update();
}

function everyinterval(n) {
  return (myGameArea.frameNo / n) % 1 == 0;
}

export function accelerate(n) {
  myGamePiece.gravity = n * myGamePiece.initialGravity;
}