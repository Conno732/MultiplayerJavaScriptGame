class InputHandler {
  constructor(player) {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "d":
        case "ArrowRight":
          player.moveRight();
          break;
        case "a":
        case "ArrowLeft":
          player.moveLeft();
          break;
        case "w":
        case "ArrowUp":
          player.moveUp();
          break;
        case "s":
        case "ArrowDown":
          player.moveDown();
          break;
        case " ":
          player.boost();
          break;
      }
      document.addEventListener("keyup", (event) => {
        switch (event.key) {
          case "d":
          case "ArrowRight":
            player.stopX();
            break;
          case "a":
          case "ArrowLeft":
            player.stopX();
            break;
          case "w":
          case "ArrowUp":
            player.stopY();
            break;
          case "s":
          case "ArrowDown":
            player.stopY();
            break;
          case " ":
            player.stopBoost();
            break;
        }
      });
    });
  }
}
