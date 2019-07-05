import Konva from 'konva';
import { Waypoint } from './visual.waypoint'
import { KonvaEventObject } from 'konva/types/Node';
import { VisualEditorComponent } from './visual-editor.component';
import { LabelService } from '../label.service';
import { ProductService } from '../product.service';
import { Point, Transform } from 'konva/types/Util';
import { WaypointService } from '../waypoint.service';

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
  // waypoints: Waypoint[] = [];
  // labels: Konva.Rect[] = [];
  pathes: Konva.Line[] = [];

  //others
  lastSelected: Waypoint | null;

  standardTransform: Transform;

  private newScale: number = 1;


  constructor(img: HTMLImageElement, private component: VisualEditorComponent, private labelService: LabelService, private productService: ProductService, private visualEditor: VisualEditorComponent, private waypointService: WaypointService) {

    //stage
    this.stage = new Konva.Stage({
      container: 'container',
      width: img.width,
      height: img.height + 500,
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
    // console.log(this.labelService);
    // console.log(this.productService);



  }

  // rerenders all labeles connetected to a product
  updateLabels() {
    this.lblLayer.removeChildren();

    this.labelService.esls.forEach(label => {

      let rect = new Konva.Rect({
        x: this.transform({ x: label.getX() + this.stage.getTransform().getMatrix()[4], y: 0 }).x * this.newScale,
        y: this.transform({ x: 0, y: label.getY() + this.stage.getTransform().getMatrix()[5] }).y * this.newScale,
        height: 5,
        width: 10,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 1,
        draggable: true
      });

      rect.on("mouseenter", e => this.visualEditor.setActiveLabel(label));
      rect.on("mouseleave", e => this.visualEditor.removeActiveLabel());
      rect.on("dragend", e => {
        //update label position on dragging
        label.setX(rect.getPosition().x);
        label.setY(rect.getPosition().y);
      });

      this.lblLayer.add(rect);

      this.lblLayer.draw();
    });
  }

  onDrop(e) {
    console.log(e);
    //first: get available label
    this.labelService.getPrioLabel().subscribe(label => {
      //update pointer pos + label position to dragpoint
      if (label) {
        console.log("Dropped Label: ");
        console.log(label);

        this.stage.setPointersPositions(e);
        //label.setTransform(this.stage.getAbsoluteTransform().copy());
        label.setX(this.transform(null).x);
        label.setY(this.transform(null).y);

        // connect dropped product + label
        label.setProduct(this.productService.getDraggedLast());
        // this.productService.getDraggedLast().setLabel(label);
        //save to backend
        //this.productService.saveProduct(this.productService.getDraggedLast());
        this.labelService.saveLabel(label);

      } else {
        alert("Keine Labels verfügbar");
      }
    }); //implement exceptions/error (e.g. "no labels available here")
  }

  updateWaypoints() {
    this.wpLayer.removeChildren();
    this.waypointService.getWaypoints().forEach(waypoint => {
      let shape = new Konva.Circle({
        x: this.transform({ x: waypoint.getX() + this.stage.getTransform().getMatrix()[4], y: 0 }).x * this.newScale,
        y: this.transform({ x: 0, y: waypoint.getY() + this.stage.getTransform().getMatrix()[5] }).y * this.newScale,
        radius: 4,
        fill: waypoint.status === "anfang" ? "green" : waypoint.status === "ende" ? "black" : "red",
        stroke: "black",
        strokeWidth: 1,
        draggable: true
      });

      this.wpLayer.add(shape);

      shape.on("click", e => {
        console.log("shape clicked");
        e.cancelBubble = true;
        if (this.component.getSelectedMode() == "Path") { //path mode
          if (this.getLastSelected()) { //there is a predecessor selected
            if (this.getLastSelected().id != waypoint.id) { // not itself
              if (!waypoint.connectedTo.includes(this.getLastSelected())) { //not already connected
                waypoint.connectedTo.push(this.getLastSelected());
                this.getLastSelected().addConnection(waypoint);
                console.log("Connected ID: " + waypoint.id + " with ID " + this.getLastSelected().id);
              }
            }
          }
          this.setLastSelected(waypoint);
          this.drawPathes();
        }
      });
      //
      shape.on("dragmove", e => {
        waypoint.setX(this.transform(null).x);
        waypoint.setY(this.transform(null).y);
        this.drawPathes();
      });
      //
      shape.on("mouseenter", e => {
        shape.size({
          width: 16,
          height: 16
        })
        this.wpLayer.draw();
      });
      //
      shape.on("mouseout", e => {
        shape.size({
          width: 8,
          height: 8
        });
        this.wpLayer.draw();
      });
    });
    this.wpLayer.draw();
  }

  onStageClick(event: KonvaEventObject<"click">) {
    //click multiplexer
    //waypoint mode
    if (this.component.getSelectedMode() == "Waypoint") {
      console.log("Waypoint added");
      let waypoint: Waypoint = new Waypoint(this.transform(null).x, this.transform(null).y);
      this.waypointService.addWaypoint(waypoint);
      this.updateWaypoints();
    }

    //inspector mode
    if (this.component.getSelectedMode() == "Inspector") {
      this.component.setStageX(this.stage.getPointerPosition().x);
      this.component.setStageY(this.stage.getPointerPosition().y);

      this.component.setStageTransformedX(this.transform(null).x);
      this.component.setStageTransformedY(this.transform(null).y);

      this.component.setTrans(this.stage.getTransform());
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

    this.newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    //limit zoom to reasonable values
    if (this.newScale < 0.1) {
      this.newScale = 0.1;
    }

    if (this.newScale > 30) {
      this.newScale = 30;
    }

    this.stage.scale({
      x: this.newScale,
      y: this.newScale
    });

    this.component.setZoomScale(this.newScale);

    let newPos = {
      x:
        -(mousePointTo.x - this.stage.getPointerPosition().x / this.newScale) *
        this.newScale,
      y:
        -(mousePointTo.y - this.stage.getPointerPosition().y / this.newScale) *
        this.newScale
    };
    this.stage.position(newPos);
    this.stage.batchDraw();
    this.component.setTrans(this.stage.getTransform());
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
        this.pathLayer.batchDraw();
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

    this.waypointService.getWaypoints().forEach(outerWaypoint => {
      outerWaypoint.connectedTo.forEach(innerWaypoint => {
        this.pathLayer.add(new Konva.Line({
          points: [
            this.transform({ x: outerWaypoint.getX() + this.stage.getTransform().getMatrix()[4], y: 0 }).x * this.newScale,
            this.transform({ x: 0, y: outerWaypoint.getY() + this.stage.getTransform().getMatrix()[5] }).y * this.newScale,
            this.transform({ x: innerWaypoint.getX() + this.stage.getTransform().getMatrix()[4], y: 0 }).x * this.newScale,
            this.transform({ x: 0, y: innerWaypoint.getY() + this.stage.getTransform().getMatrix()[5] }).y * this.newScale,
          ],
          stroke: "black",
          strokeWidth: 2,
          lineCap: "round"
        }))
      });
    });
    this.pathLayer.draw();
  }

  //do some resetting
  onModeChange() {
    this.drawPathes();
    this.lastSelected = null;
  }
}
