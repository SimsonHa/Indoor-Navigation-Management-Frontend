import { Injectable } from '@angular/core';
import { Label } from './entities/label';
import { Observable, of } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class LabelService {

  labels: Label[] = [
    new Label("00:80:41:ae:fd:7e", 10, 10),
    new Label("00:80:41:ae:fd:7e", 20, 20),
    new Label("00:80:41:ae:fd:7e", 30, 30),
    new Label("00:80:41:ae:fd:7e", 40, 40),
    new Label("00:80:41:ae:fd:7e", 50, 50),
    new Label("00:80:41:ae:fd:7e", 60, 60),
    new Label("00:80:41:ae:fd:7e", 70, 70),
    new Label("00:80:41:ae:fd:7e", 80, 80),
    new Label("00:80:41:ae:fd:7e", 90, 90),
    new Label("00:80:41:ae:fd:7e", 100, 120),
    new Label("00:80:41:ae:fd:7e", 110, 120),
  ]

  constructor() { }

  //returns all registered active labels ready for use
  getLabels(): Observable<Label[]> {
    return of(this.labels);
  }

  getLabel(id: number): Observable<Label> {
    return of(this.labels.find(label => label.id === id));
  }
  //get unselected labels (later with priority implementation)
  getPrioLabel(): Observable<Label> {
    return of(this.labels.find(label => label.product == null));
  }

  getConnectedLabels(): Observable<Label[]> {
    return of(this.labels.filter(label => label.product != null));
  }

  saveLabel(label: Label) {
    //push label to DB here
    //only if prodcut is connetected a saving makes sense
    //(otherwise pi registers itself as being available anyways)
    if(label.getProduct()) {
      this.labels.push(label);
    }
    console.log("Saved Label with Id: " + label.id);
  }
}
