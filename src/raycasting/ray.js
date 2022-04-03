export class Ray {
  constructor(x, y, angle) {
    this.origin = [x, y];
    angle = angle * (Math.PI / 180);
    this.dir = [Math.cos(angle), Math.sin(angle)];
  }

  draw(ctx, x, y) {
    ctx.beginPath();
    ctx.moveTo(this.origin[0], this.origin[1]);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  //wall[x1, y1, x2, y2]
  // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
  cast(wall) {
    // console.log(wall);
    const x1 = wall[0];
    const y1 = wall[1];
    const x2 = wall[2];
    const y2 = wall[3];

    const x3 = this.origin[0];
    const y3 = this.origin[1];
    const x4 = this.origin[0] + this.dir[0];
    const y4 = this.origin[1] + this.dir[1];
    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denominator == 0) return;
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;
    // console.log(t, u);
    if (t >= 0 && t <= 1 && u >= 0) {
      const point = [];
      point[0] = x1 + t * (x2 - x1);
      point[1] = y1 + t * (y2 - y1);
      return point;
    } else return;
  }

  update(x, y) {
    this.origin[0] = x;
    this.origin[1] = y;
  }
}
