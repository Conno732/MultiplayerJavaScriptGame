import { gameManager } from "./gameManager.js";
import { canvasGen } from "./canvasLayer/canvasGen.js";

function initGame(host) {
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
  game.start(context, host);
}

const startButton = document.getElementById("start-game");
const overlay = document.getElementById("overlay");
startButton.addEventListener("click", () => {
  overlay.style.display = "none";
  const hostIn = document.getElementById("host");
  const host = hostIn.value;
  initGame(host);
});
