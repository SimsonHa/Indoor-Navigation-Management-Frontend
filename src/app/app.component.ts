import { Component } from '@angular/core';
import { LabelService } from './label.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SIN';

  constructor(private labelService : LabelService) {
  }
}
