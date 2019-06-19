import { Injectable } from '@angular/core';
import { Label } from './entities/label';
import { LABELS } from './mocks/label-mocks';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabelService {

  constructor() { }

  //returns all registered active labels ready for use
  getLabels(): Observable<Label[]> {
      return of(LABELS);
  }

  getLabel(id: number): Observable<Label> {
    return of(LABELS.find(label => label.id === id));
  }

  saveLabel(label : Label) {
    //push label to DB here
    console.log("Saved Label with Id: "+ label.id);
  }
}
