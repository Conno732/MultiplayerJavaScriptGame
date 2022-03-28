class Key {
  constructor(cellSize, posX, posY, radius, player) {
    this.x = cellSize * posX - cellSize / 2;
    this.y = cellSize * posY - cellSize / 2;
    this.radius = cellSize / 3;
    this.enabled = true;
  }

  draw(context) {
    if (!this.enabled) return;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = "yellow";
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();
  }

  // update(context) {
  //   if (!this.shown) return;
  //   this.draw(context);
  //   if (this.player.x)
  // }
}
