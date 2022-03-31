export class Exit {
  constructor(cellSize, posX, posY, size) {
    if (!cellSize) return;
    this.x = cellSize * posX + size / 20;
    this.y = cellSize * posY + size / 20;
    this.size = size - size / 10;
    this.unlocked = false;
  }
  buildFromData(cellSize, x, y) {
    this.x = x;
    this.y = y;
    this.cellSize = cellSize;
    this.size = cellSize - cellSize / 10;
  }
  draw(context) {
    context.beginPath();
    context.fillStyle = " #964B00";
    context.fillRect(this.x, this.y, this.size, this.size);
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();
  }
}
