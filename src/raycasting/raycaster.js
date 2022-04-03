import { Ray } from "./ray";

export class RayCaster {
  constructor(x, y, walls) {
    this.pos;
    this.rays = [];
    this.angleDiv = 1;
    this.walls = walls;
    for (let i = 0; i < 360; i += this.angleDiv) {
      this.rays[i / this.angleDiv] = new Ray(x, y, i);
    }
  }

  update(x, y, context) {
    let points = [];
    for (let i = 0; i < 360; i += this.angleDiv) {
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
          // if (distance >= 200)
          point = pt;
        }
      }
      if (!point) continue;
      //this.rays[i / this.angleDiv].draw(context, point[0], point[1]);
      // this.rays[i / this.angleDiv].draw(context);
      points.push(point);
    }
    // context.fillStyle = "#f00";
    context.save();
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) {
      context.lineTo(points[i][0], points[i][1]);
    }
    context.closePath();
    context.clip();
    //return points;
  }
}
