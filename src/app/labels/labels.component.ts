import { Component, OnInit } from '@angular/core';
import { LabelService } from '../label.service';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {

  constructor(private labelService: LabelService) { }

  ngOnInit() {
    this.getLabels();
  }

  getLabels(): void {
    this.labelService.getLabels();
  }
}
