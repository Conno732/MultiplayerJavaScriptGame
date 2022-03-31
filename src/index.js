import { gameManager } from "./gameManager.js";
import { canvasGen } from "./canvasLayer/canvasGen.js";

function initGame() {
  const width = 1080;
  const height = 720;
  const canvas = new canvasGen(width, height);
  const context = canvas.getCanvas().getContext("2d");
  const cellFactor = 3;
  const lineWidth = 3;
  const game = new gameManager(
    height,
    width,
    12 * cellFactor,
    cellFactor,
    lineWidth
  );
  let host = window.prompt("Enter host if guest, otherwise hit enter");
  game.start(context, host);
}

initGame();
