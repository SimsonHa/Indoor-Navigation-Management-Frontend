import { Component, OnInit } from '@angular/core';
import { Canvas } from './visual.canvas';
import { ProductService } from '../product.service';
import { LabelService } from '../label.service';
import { Label } from '../entities/label';
import { Transform } from 'konva/types/Util';
import { WaypointService } from '../waypoint.service';
// import Canvas from 'konva';


@Component({
  selector: 'app-visual-editor',
  templateUrl: './visual-editor.component.html',
  styleUrls: ['./visual-editor.component.css']
})
export class VisualEditorComponent implements OnInit {

  canvas: Canvas;
  selectedMode: string = "Waypoint";
  modes: string[] = ["Waypoint", "Path"];

  activeLabel: Label | null;

  stageX: number = 0;
  stageY: number = 0;

  stageTransformedX: number = 0;
  stageTransformedY: number = 0;

  stageZoom: number = 0;

  transform: number[] = null;

  constructor(private productService: ProductService, private labelService: LabelService, private waypointService: WaypointService) { }

  ngOnInit(): void {
    // upload picture here later
    // create configStage
    // etc
    let img = new Image();

    img.src = '../assets/test.JPG';
    img.onload = () => {
      this.canvas = new Canvas(img, this, this.labelService, this.productService, this, this.waypointService);
      this.labelService.setCanvas(this.canvas);
      this.waypointService.setCanvas(this.canvas);
      this.labelService.getLabels();
      this.waypointService.reloadWaypoints();
    }
  }

  getSelectedMode(): String {
    return this.selectedMode;
  }

  onModeChange(event) {
    this.canvas.onModeChange();
  }

  setActiveLabel(label: Label) {
    console.log(label);
    this.activeLabel = label;
  }

  removeActiveLabel() {
    this.activeLabel = null;
  }

  setStageX(stageX: number) {
    this.stageX = stageX;
  }
  setStageY(stageY: number) {
    this.stageY = stageY;
  }
  setStageTransformedX(stageTransformedX: number) {
    this.stageTransformedX = stageTransformedX;
  }
  setStageTransformedY(stageTransformedY: number) {
    this.stageTransformedY = stageTransformedY;
  }
  setZoomScale(stageZoom: number) {
    this.stageZoom = stageZoom;
  }

  setTrans(transform: Transform) {
    this.transform = transform.getMatrix();
  }

  saveWaypoints() {
    this.waypointService.saveWaypoints();
  }
}
