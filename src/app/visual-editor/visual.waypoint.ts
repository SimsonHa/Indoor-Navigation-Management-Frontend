export class Waypoint {

  static waypointCounter: number = 0;

  id: number;
  x: number;
  y: number;
  connectedTo: Waypoint[] = [];
  status: String = "ende";
  // transform: Transform = null;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.id = Waypoint.waypointCounter++;

    if (this.id == 0) {
      this.status = "anfang";
    }
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  setX(x: number) {
    this.x = x;
  }

  setY(y: number) {
    this.y = y;
  }

  addConnection(waypoint: Waypoint) {
    this.connectedTo.push(waypoint);
  }
}
