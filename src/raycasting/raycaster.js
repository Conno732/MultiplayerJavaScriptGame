import { Ray } from "./ray";

export class RayCaster {
  constructor(x, y, walls) {
    this.pos;
    this.rays = [];
    this.angleDiv = 0.5;
    this.walls = walls;
    this.canvas = [];
    for (let i = 0; i < 360; i += this.angleDiv) {
      this.rays[i / this.angleDiv] = new Ray(x, y, i);
    }
  }

  update(x, y, context, angle) {
    let points = [];
    this.canvas = [];
    //console.log(this.rays);
    console.log(angle);
    let tmpcalc = angle;
    if (tmpcalc + 45 >= 360) tmpcalc = tmpcalc - 360 + 45;
    if (tmpcalc + 45 < 0) tmpcalc = 360 + tmpcalc + 45;

    for (let j = angle; j < angle + 90; j += this.angleDiv) {
      let i = j;
      if (i < 0) i = 360 + i;
      if (i >= 360) i = i - 360;
      // console.log(i / this.angleDiv);
      this.rays[i / this.angleDiv].update(x, y);
      let smallestDistance = Infinity;
      let point = null;
      for (let j = 0; j < this.walls.length; j += 1) {
        const pt = this.rays[i / this.angleDiv].cast(this.walls[j]);
        if (!pt) continue;
        const xDif = Math.abs(pt[0] - this.rays[i / this.angleDiv].origin[0]);
        const yDif = Math.abs(pt[1] - this.rays[i / this.angleDiv].origin[1]);
        const distance = Math.sqrt(xDif * xDif + yDif * yDif);
        if (Math.abs(distance) < Math.abs(smallestDistance)) {
          smallestDistance = distance;
          point = pt;
          if (point && distance >= 100) {
            point[0] =
              this.rays[i / this.angleDiv].origin[0] +
              this.rays[i / this.angleDiv].dir[0] * 100;
            point[1] =
              this.rays[i / this.angleDiv].origin[1] +
              this.rays[i / this.angleDiv].dir[1] * 100;
          }
        }
      }

      if (point) this.canvas.push(smallestDistance);
      else this.canvas.push(Infinity);

      points.push(point);
      if (!point) continue;
      this.rays[i / this.angleDiv].draw(context, point[0], point[1]);
      // this.rays[i / this.angleDiv].draw(context);
    }

    // context.fillStyle = "#f00";
    // context.save();
    // context.beginPath();
    //context.moveTo(points[0][0], points[0][1]);
    //for (let i = 1; i < points.length; i += 1) {
    ///context.lineTo(points[i][0], points[i][1]);

    //}
    //context.closePath();
    //context.clip();
    //return points;
  }

  drawCasting(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < this.canvas.length; i++) {
      if (this.canvas[i] === Infinity) continue;
      // console.log(height - height / this.canvas[i]);
      ctx.beginPath();
      ctx.fillStyle = "darkgrey";
      ctx.rect(
        i * (this.angleDiv / 90) * width,
        height / this.canvas[i] + 50,
        (this.angleDiv / 90) * width,
        height / (this.canvas[i] * 0.06)
      );
      ctx.fill();
    }
  }
}
