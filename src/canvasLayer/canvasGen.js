export class canvasGen {
  constructor(width = 1080, height = 720) {
    this.gameCanvas = document.querySelector("canvas");
    this.gameContainer = document.getElementById("game-container");
    this.gameContainer.style.width = `${width}px`;
    this.gameContainer.style.height = `${height}px`;
    this.gameContainer.style.display = "block";
    this.gameCanvas.height = height;
    this.gameCanvas.width = width;
  }

  getCanvas() {
    return this.gameCanvas;
  }
}
