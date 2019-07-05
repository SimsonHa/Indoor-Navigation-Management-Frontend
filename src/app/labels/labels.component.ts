import { Component, OnInit } from '@angular/core';
import { Label } from '../entities/label';
import { LabelService } from '../label.service';
import { MatDialog } from '@angular/material';
import { LabelDetailComponent } from '../label-detail/label-detail.component';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {

  constructor(private labelService: LabelService, public labelDialog: MatDialog) { }

  ngOnInit() {
    this.getLabels();
  }

  getLabels(): void {
    this.labelService.getLabels();
  }

  openDialog(label: Label): void {
    const dialogRef = this.labelDialog.open(LabelDetailComponent, {
      data: [label, this.labelService]
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getLabels();
    });
  }
}
