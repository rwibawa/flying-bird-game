var myGamePiece;

function startGame() {
  myGameArea.start();
  myGamePiece = new component(30, 30, "red", 10, 120);
}

const myGameArea = {
  canvas: document.createElement("canvas"),

  start: function() {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");

    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);

    // Keyboard as Controller
    window.addEventListener('keydown', (e) => {
      // myGameArea.key = e.keyCode; // single key pressed

      // Multiple Keys Pressed
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = true;
    });

    window.addEventListener('keyup', (e) => {
      // myGameArea.key = false; // single key unpressed

      // Multiple Keys Unpressed
      myGameArea.keys[e.keyCode] = false;
    });

    // Using The Mouse Cursor as a Controller
    this.canvas.style.cursor = "none"; //hide the original cursor
    window.addEventListener('mousemove', function (e) {
      myGameArea.x = e.pageX;
      myGameArea.y = e.pageY;
    });
  },

  clear: function() {
    this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
  }
}

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  
  this.x = x;
  this.y = y;
  
  this.speedX = 0;
  this.speedY = 0;

  this.update = function() {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

function updateGameArea() {
  myGameArea.clear();

  // keyboard handlers
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;

   // single key pressed
  // if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -1; } // left arrow
  // if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 1; }  // right arrow
  // if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -1; } // up arrow
  // if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 1; }  // down arrow

  // Multiple Keys Pressed
  if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -1; }
  if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 1; }
  if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -1; }
  if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 1; }

  // Using The Mouse Cursor as a Controller
  if (myGameArea.x && myGameArea.y) {
    myGamePiece.x = myGameArea.x;
    myGamePiece.y = myGameArea.y;
  }

  myGamePiece.newPos();
  myGamePiece.update();
}

function moveup() {
  myGamePiece.speedY -= 1;
}

function movedown() {
  myGamePiece.speedY += 1;
}

function moveleft() {
  myGamePiece.speedX -= 1;
}

function moveright() {
  myGamePiece.speedX += 1;
}

function stopMove() {
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
}