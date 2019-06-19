import Konva from 'konva';
import { Waypoint } from './visual.waypoint'
import { KonvaEventObject } from 'konva/types/Node';
import { Point } from 'konva/types/Util';
import { VisualEditorComponent } from './visual-editor.component';

export class Canvas {

  //stage
  stage: Konva.Stage;

  //layers
  bgLayer: Konva.Layer; // background image
  pathLayer: Konva.Layer; // pathes
  wpLayer: Konva.Layer; // waypoints
  lblLayer: Konva.Layer; // labels
  liveLayer: Konva.Layer; // live previews

  //canvas elements (wp, lbl, pathes)
  waypoints: Waypoint[] = [];
  labels: Konva.Rect[] = [];
  pathes: Konva.Line[] = [];

  //others
  lastSelected: Waypoint | null;

  constructor(img: HTMLImageElement, private component: VisualEditorComponent) {
    //stage
    this.stage = new Konva.Stage({
      container: 'container',
      width: img.width,
      height: img.height,
      draggable: true
    });

    this.stage.on("click", event => this.onStageClick(event));
    this.stage.on("wheel", event => this.onStageZoom(event));
    this.stage.on("mousemove", event => this.onMouseMove(event));
    //bg image
    let bgImage = new Konva.Image({
      x: 0,
      y: 0,
      image: img,
      width: img.width,
      height: img.height
    });

    //layers
    this.bgLayer = new Konva.Layer();
    this.bgLayer.add(bgImage);
    this.pathLayer = new Konva.Layer();
    this.wpLayer = new Konva.Layer();
    this.lblLayer = new Konva.Layer();
    this.liveLayer = new Konva.Layer();

    //adding layers
    this.stage.add(this.bgLayer);
    this.stage.add(this.pathLayer);
    this.stage.add(this.wpLayer);
    this.stage.add(this.lblLayer);
    this.stage.add(this.liveLayer);

    //draw
    this.stage.draw();

    var con = this.stage.container();
    con.addEventListener('dragover', e => {
      e.preventDefault(); // !important
    });

    con.addEventListener('drop', e => {
      e.preventDefault();
      console.log(e);
      // now we need to find pointer position
      // we can't use stage.getPointerPosition() here, because that event
      // is not registered by Konva.Stage
      // we can register it manually:
      this.stage.setPointersPositions(e);
      this.lblLayer.add(new Konva.Rect({
        x: this.transform(null).x,
        y: this.transform(null).y,
        width: 7,
        height: 5,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 1,
        draggable: true
      }))
      this.lblLayer.draw();
    });
  }

  onStageClick(event: KonvaEventObject<"click">) {
    // click multiplexer
    //waypoint mode
    if (this.component.getSelectedMode() == "Waypoint") {
      this.waypoints.push(new Waypoint(this.transform(null).x, this.transform(null).y, this.component, this));
      this.wpLayer.add(this.waypoints[this.waypoints.length - 1].getShape());
      this.wpLayer.draw();
    }

    //label mode
    if (this.component.getSelectedMode() == "Label") {

    }
  }

  onStageZoom(e) {
    let scaleBy = 1.2;

    e.evt.preventDefault();
    let oldScale = this.stage.scaleX();

    let mousePointTo = {
      x: this.stage.getPointerPosition().x / oldScale - this.stage.x() / oldScale,
      y: this.stage.getPointerPosition().y / oldScale - this.stage.y() / oldScale
    };

    let newScale =
      e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    this.stage.scale({
      x: newScale,
      y: newScale
    });

    let newPos = {
      x:
        -(mousePointTo.x - this.stage.getPointerPosition().x / newScale) *
        newScale,
      y:
        -(mousePointTo.y - this.stage.getPointerPosition().y / newScale) *
        newScale
    };
    this.stage.position(newPos);
    this.stage.batchDraw();
  }

  onMouseMove(event: KonvaEventObject<"mousemove">): void {
    //in path mode, show preview lineCap
    if (this.component.getSelectedMode() === "Path") {
      if (this.lastSelected) {
        this.drawPathes();
        this.pathLayer.add(new Konva.Line({
          points: [this.lastSelected.getX(), this.lastSelected.getY(), this.transform(null).x, this.transform(null).y],
          stroke: "gray",
          strokeWidth: 2,
          lineCap: "round"
        }));
        this.pathLayer.draw();
      }
    }
  }

  //null parameter returns current pointer pos
  transform(pos: Point): Point {
    let transform = this.stage.getAbsoluteTransform().copy().invert();
    if (pos) {
      return transform.point(pos);
    } else {
      pos = this.stage.getPointerPosition();
      return transform.point(pos);
    }
  }

  getLastSelected(): Waypoint {
    return this.lastSelected;
  }

  setLastSelected(waypoint: Waypoint) {
    this.lastSelected = waypoint;
  }

  drawPathes() {
    this.pathLayer.destroyChildren();
    for (let i = 0; i < this.waypoints.length; i++) {
      for (let j = 0; j < this.waypoints[i].connectedTo.length; j++) {
        this.pathLayer.add(new Konva.Line({
          points: [this.waypoints[i].getX(), this.waypoints[i].getY(), this.waypoints[i].connectedTo[j].getX(), this.waypoints[i].connectedTo[j].getY()],
          stroke: "black",
          strokeWidth: 2,
          lineCap: "round"
        }))
      }
    }
    this.pathLayer.draw();
  }

  //do some resetting
  onModeChange() {
    this.drawPathes();
    this.lastSelected = null;

  }
}
