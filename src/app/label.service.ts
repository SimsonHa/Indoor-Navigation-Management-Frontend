import { Injectable } from '@angular/core';
import { Label } from './entities/label';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Esl } from './import.esl';
import { EKategorie, EArtikel, ELabel, ELabelWrapper } from './export.labelpi';
import { Canvas } from './visual-editor/visual.canvas';

@Injectable()
export class LabelService {

  availableLabels: number = 0;

  labels: Label[] = [];
  esls: Label[] = [];

  private canvas: Canvas;

  setCanvas(canvas: Canvas) {
    this.canvas = canvas;
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) {
  }

  //returns all registered active labels ready for use
  getLabels(): void {
    this.labels = [];
    this.esls = [];

    this.http.get<JSON>("http://localhost:8080/pi", this.httpOptions).subscribe(piJson => {
      let importLabels: Pi[] = JSON.parse(JSON.stringify(piJson));

      //remove already connected pis
      this.http.get<JSON>("http://localhost:8080/esl", this.httpOptions).subscribe(eslSon => {
        let importEsl: Esl[] = JSON.parse(JSON.stringify(eslSon));

        let final: Label[] = [];

        //filter connected pis out
        importLabels.forEach(iL => {
          let found: boolean = false;
          importEsl.forEach(iE => {
            if (iL.macAdres == iE.pi.macAdres) {
              found = true;
            }
          });
          if (!found) {
            final.push(new Label(iL.macAdres, undefined, undefined));
          }
        });

        this.esls = [];
        importEsl.forEach(esl => {
          this.esls.push(new Label(esl.pi.macAdres, esl.posX, esl.posY));
          this.esls[this.esls.length - 1].artikel = esl.artikel;
        });

        this.labels = final;

        this.evaluateAvailable();
        try {
          this.canvas.updateLabels();
        } catch (e) {
          //not registeres yet -ignored
         };
      });
    });
  }

  //return first label which is not connected
  getPrioLabel(): Observable<Label> {
    return of(this.labels.filter(label => label.artikel === null)[0]);
  }

  //check how many labels are available (for preview in tab title)
  evaluateAvailable() {
    this.availableLabels = this.labels.length;
  }

  //save label after connection to article is made with a drop in the editor
  saveLabel(label: Label) {
    this.http.post<String>("http://localhost:8080/piConnect", this.stringifyLabel(label), this.httpOptions).subscribe(done => {
      this.getLabels();
    }); //handling errors here later
  }

  // json parsing... not great
  stringifyLabel(label: Label) {
    let kat: EKategorie = { name: label.artikel.category };
    let artikel: EArtikel = {
      id: label.artikel.id,
      name: label.artikel.name,
      preis: label.artikel.price,
      artNr: label.artikel.artNr,
      kategorie: kat
    }

    let eLabel: ELabel = {
      mac: label.macAdres,
      x: label.posX,
      y: label.posY
    }

    let wrapper: ELabelWrapper = {
      artikel: artikel,
      label: eLabel
    }
    console.log(JSON.stringify(wrapper))
    return JSON.stringify(wrapper);
  }
}
