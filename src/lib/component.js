export function component(gameArea, context, width, height, color, x, y, type, gravity = 0) {
  var gameArea = gameArea;
  var ctx = context;

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

  this.bounce = 0.6;
  this.angle = 0;

  this.update = function() {
    ctx.fillStyle = color;

    if (this.angle > 0) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
    }
    
    if (this.type === "text") {
      ctx.font = this.width + " " + this.height;
      if (this.angle > 0) {
        ctx.fillText(this.text, this.width / -2, this.height / -2);
        ctx.restore();

        return;
      }

      ctx.fillText(this.text, this.x, this.y);

      return;
    }

    if (this.type === "image" || this.type === "background") {

      if (this.angle > 0) {
        ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();

        return;
      }

      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

      if (this.type === "background") {
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
      }

      return;
    }

    if (this.angle > 0) {
      ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
      ctx.restore();

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
    var rockbottom = gameArea.canvas.height - this.height;
    if (this.y > rockbottom) {
      this.y = rockbottom;
      this.gravitySpeed = -(this.gravitySpeed * this.bounce);
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

    if (this.type === 'image') {
      this.image.src = "../../resources/img/smiley.gif";
    }
  }

  this.move = function () {
    if (Object.keys(gameArea.keys).length == 0) {
      return;
    }

    if (this.type === 'image') {
      this.image.src = "../../resources/img/angry.gif";
    }

    // Multiple Keys Pressed
    if (gameArea.keys[37]) { this.speedX = -1; }
    if (gameArea.keys[39]) { this.speedX = 1; }
    if (gameArea.keys[38]) { this.speedY = -1; }
    if (gameArea.keys[40]) { this.speedY = 1; }
  }
}
