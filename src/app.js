var redGamePiece, greenGamePiece, blueGamePiece;

function startGame() {
  myGameArea.start();
  redGamePiece = new component(30, 30, "red", 10, 60);
  greenGamePiece = new component(30, 30, "green", 10, 120);
  blueGamePiece = new component(30, 30, "blue", 10, 180);
}

const myGameArea = {
  canvas: document.createElement("canvas"),

  start: function() {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");

    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);;
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
  this.update = function() {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function updateGameArea() {
  myGameArea.clear();

  redGamePiece.update();
  redGamePiece.x++;

  greenGamePiece.update();
  greenGamePiece.x += 2;

  blueGamePiece.update();
  blueGamePiece.x += 5;
}