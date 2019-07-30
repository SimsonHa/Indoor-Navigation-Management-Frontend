export class Waypoint {

  static waypointCounter: number = 0;

  id: number;
  x: number;
  y: number;
  connectedTo: Waypoint[] = [];
  //latest set waypoint is always the end.. therefore this could be preinitalised
  status: String = "ende";

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.id = Waypoint.waypointCounter++;

    //if it is the first one, its rather start then end...
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
