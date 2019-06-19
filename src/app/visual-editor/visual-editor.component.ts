import { Component, OnInit } from '@angular/core';
import { Canvas } from './visual.canvas';
import {CdkDragDrop } from '@angular/cdk/drag-drop';
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

  ngOnInit(): void {
    // upload picture here
    // create configStage
    // etc
    let img = new Image();

    img.src = '../assets/test.JPG';
    img.onload = () => {
      this.canvas = new Canvas(img, this);
    }
  }

  getSelectedMode() : String {
    return this.selectedMode;
  }

  onModeChange(event) {
    this.canvas.onModeChange();
  }

}
