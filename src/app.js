import { component } from "./lib/component.js";
import { sound } from "./lib/sound.js";

var myGamePiece;
var myObstacles = [];
var myScore;
var myBackground;
var mySound;
var myMusic;

export function startGame() {
  myGameArea.start();

  myGamePiece = new component(myGameArea, myGameArea.context, 30, 30, "red", 10, 120, "box", 0.05);
  myBackground = new component(myGameArea, myGameArea.context,  656, 270, "../resources/img/citymarket.jpg", 0, 0, "background");
  
  // Moving Background to the left
  myBackground.speedX = -1;

  myScore = new component(myGameArea, myGameArea.context,  "30px", "Consolos", "black", 280, 40, "text");
  mySound = new sound("../resources/audio/bounce.mp3");
  myMusic = new sound("../resources/audio/gametheme.mp3");
  myMusic.play();
}

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

  // rotate the Game Piece
  myGamePiece.angle += 1 * Math.PI / 180;

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
      myObstacles.push(new component(myGameArea, myGameArea.context, 10, height, "green", x, 0));
      myObstacles.push(new component(myGameArea, myGameArea.context, 10, x - height - gap, "green", x, height + gap));
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