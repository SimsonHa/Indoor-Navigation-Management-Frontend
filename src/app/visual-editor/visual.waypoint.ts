import Konva from 'konva';
import { Canvas } from './visual.canvas';
import { KonvaEventObject } from 'konva/types/Node';
import { VisualEditorComponent } from './visual-editor.component';

export class Waypoint {

  static waypointCounter: number = 0;

  id: Number;
  connectedTo: Waypoint[] = [];
  shape: Konva.Circle;

  constructor(x: number, y: number, private component: VisualEditorComponent, private canvas: Canvas) {
    this.id = Waypoint.waypointCounter++;
    this.shape = new Konva.Circle({
      x: x,
      y: y,
      radius: 4,
      fill: "red",
      stroke: "black",
      strokeWidth: 1,
      draggable: true
    });

    this.shape.on("click", e => this.onClick(e));
    this.shape.on("dragmove", e => this.onDrag(e));
    this.shape.on("mouseenter", e => this.onMouseEnter(e));
    this.shape.on("mouseout", e => this.onMouseOut(e));
  }

  onClick(e: KonvaEventObject<"click">) {
    console.log("shape clicked");
    e.cancelBubble = true;
    if (this.component.getSelectedMode() == "Path") { //path mode
      if (this.canvas.getLastSelected()) { //there is a predecessor selected
        if (this.canvas.getLastSelected().getId() != this.id) { // not itself
          if (!this.connectedTo.includes(this.canvas.getLastSelected())) { //not already connected
            this.connectedTo.push(this.canvas.getLastSelected());
            this.canvas.getLastSelected().addConnection(this);
            console.log("Connected ID: " + this.id + " with ID " + this.canvas.getLastSelected().getId());
          }
        }
      }
      this.canvas.setLastSelected(this);
      this.canvas.drawPathes();
    }
  }

  onDrag(e: KonvaEventObject<"dragmove">): void {
    this.shape.setPosition(this.canvas.transform(null));
    this.canvas.drawPathes();
  }

  onMouseEnter(e: KonvaEventObject<"mouseenter">) : void {
    this.shape.size({
      width: 16,
      height:16
    })
    this.canvas.wpLayer.draw();
  }

  onMouseOut(e: KonvaEventObject<"mouseout">) : void {
    this.shape.size({
      width: 8,
      height:8
    })
    this.canvas.wpLayer.draw();

  }

  getX(): number {
    return this.shape.getPosition().x;
  }

  getY(): number {
    return this.shape.getPosition().y;
  }

  getShape() {
    return this.shape;
  }

  addConnection(waypoint: Waypoint) {
    this.connectedTo.push(waypoint);
  }

  getId() {
    return this.id;
  }


  //return {x, y, conntectedTo.export}
  export() {

  }
}
