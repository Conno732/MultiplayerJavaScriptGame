class Key {
  constructor(posX, posY, radius) {
    this.x = posX;
    this.y = posY;
    this.radius = radius;
    this.shown = true;
  }

  draw(context) {
    if (!this.shown) return;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = "yellow";
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();
  }
}
