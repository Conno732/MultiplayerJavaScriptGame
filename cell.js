class Cell {
  constructor(x, y) {
    this.right = 1;
    this.bottom = 1;
    this.visited = false;
    this.x = x;
    this.y = y;
  }

  eraseRight() {
    this.right = 0;
  }
  eraseBottom() {
    this.bottom = 0;
  }
  checkRight() {
    return this.right;
  }
  checkBottom() {
    return this.bottom;
  }
  getVisited() {
    return this.visited;
  }
  setVisited() {
    this.visited = true;
  }
  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }
}
