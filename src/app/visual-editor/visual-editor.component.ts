import { Component, OnInit } from '@angular/core';
import { Canvas } from './visual.canvas';
import { ProductService } from '../product.service';
import { LabelService } from '../label.service';
import { Label } from '../entities/label';
// import Canvas from 'konva';


@Component({
  selector: 'app-visual-editor',
  templateUrl: './visual-editor.component.html',
  styleUrls: ['./visual-editor.component.css']
})
export class VisualEditorComponent implements OnInit {

  canvas : Canvas;
  selectedMode: string;
  modes: string[] = ["Waypoint", "Path", "Label"];
  activeLabel : Label | null;

  constructor(private productService : ProductService, private labelService : LabelService) {}

  ngOnInit(): void {
    // upload picture here
    // create configStage
    // etc
    let img = new Image();

    img.src = '../assets/test.JPG';
    img.onload = () => {
      this.canvas = new Canvas(img, this, this.labelService, this.productService, this);
    }
  }

  getSelectedMode() : String {
    return this.selectedMode;
  }

  onModeChange(event) {
    this.canvas.onModeChange();
  }

  setActiveLabel(label : Label) {
    this.activeLabel = label;
  }

  removeActiveLabel() {
    this.activeLabel = null;
  }
}
