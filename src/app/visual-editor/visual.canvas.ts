import Konva from 'konva';
import { Waypoint } from './visual.waypoint'
import { KonvaEventObject } from 'konva/types/Node';
import { VisualEditorComponent } from './visual-editor.component';
import { LabelService } from '../label.service';
import { ProductService } from '../product.service';
import { Point, Transform } from 'konva/types/Util';

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

  standardTransform : Transform;

  stageX : number = 0;
  stageY : number = 0;

  stageTransformedX : number = 0;
  stageTransformedY : number = 0;

  stageZoom : number = 0;

  constructor(img: HTMLImageElement, private component: VisualEditorComponent, private labelService: LabelService, private productService: ProductService, private visualEditor: VisualEditorComponent) {

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

    con.addEventListener('drop', (e) => {
      e.preventDefault();
      this.onDrop(e);
      this.updateLabels();
    });

    //test
    console.log(this.labelService);
    console.log(this.productService);
  }

  // rerenders all labeles connetected to a product
  updateLabels() {
    this.lblLayer.removeChildren();

    this.labelService.getConnectedLabels().subscribe(labels => labels.forEach(label => {
      console.log("Label for " + label.getProduct().getName() + " added");
      console.log("Subscribe content: " + labels.length);

      let rect = new Konva.Rect({
        x: this.transform({x: label.getX(),y: 0}).x,
        y: this.transform({x: 0, y: label.getY()}).y,
        width: 7,
        height: 5,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 1,
        draggable: true
      });

      rect.on("mouseenter", e => this.visualEditor.setActiveLabel(label));
      rect.on("mouseleave", e => this.visualEditor.removeActiveLabel());

      this.lblLayer.add(rect);
    }));

    this.lblLayer.draw();
  }

  onDrop(e) {
    console.log(e);
    //first: get available label
    this.labelService.getPrioLabel().subscribe(label => {
      //update pointer pos + label position to dragpoint
      console.log("Label: " + label);


      this.stage.setPointersPositions(e);
      label.setX(this.transform(null).x);
      label.setY(this.transform(null).y);

      // connect dropped product + label
      label.setProduct(this.productService.getDraggedLast());
      this.productService.getDraggedLast().setLabel(label);
      //save to backend
      this.productService.saveProduct(this.productService.getDraggedLast());
      this.labelService.saveLabel(label);
    }); //implement exceptions/error (e.g. "no labels available here")
  }

  onStageClick(event: KonvaEventObject<"click">) {
    // click multiplexer
    //waypoint mode
    if (this.component.getSelectedMode() == "Waypoint") {
      console.log("Waypoint added");
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

    this.stageZoom = newScale;

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

    // console.log("Moving");

    // this.stageX = this.stage.getPointerPosition().x;
    // this.stageY = this.stage.getPointerPosition().y;
    //
    // this.stageTransformedX = this.transform(null).x;
    // this.stageTransformedY = this.transform(null).y;

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
  //(transform relative coordinates changed by zoom etc)
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
