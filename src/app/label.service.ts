import { Injectable } from '@angular/core';
import { Label } from './entities/label';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Esl } from './import.esl';
import { EKategorie, EArtikel, ELabel, ELabelWrapper } from './export.labelpi';
import { Canvas } from './visual-editor/visual.canvas';

// @Injectable({
//   providedIn: 'root'
// })
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

        // console.log(this.labels);
        this.evaluateAvailable();
        try {
          this.canvas.updateLabels();
        } catch (e) {
          //not registeres yet -ignored
         };
      });
    });
  }

  getPrioLabel(): Observable<Label> {
    return of(this.labels.filter(label => label.artikel === null)[0]);
  }

  // getConnectedLabels(): Observable<Label[]> {
  //   // return of(this.labels.filter(label => label.artikel != null));
  //   return of(this.labels);
  // }

  evaluateAvailable() {
    this.availableLabels = this.labels.length;
  }

  saveLabel(label: Label) {
    this.http.post<String>("http://localhost:8080/piConnect", this.stringifyLabel(label), this.httpOptions).subscribe(done => {
      this.getLabels();
    });

  }

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

// {
//   "artikel":
//     {
//       "id":2,
//       "name":"Spülmittel",
//       "preis":3.90,
//       "artNr":"34834rgf5erz",
//       "kategorie":
//         {
//           "name": "Haushaltswaren"
//         }
//     },
//     "label":
//       {
//         "mac":"000000003d1d1c21",
//         "x":560,
//         "y": 240
//       }
// }


// let len = importLabels.length;
// for (let i = len -1; i >= 0; --i) {
  //   // console.log(importLabels);
  //   // console.log("index: " + i);
  //   console.log(importLabels);
  //   console.log(importEsl);
  //
  //   importEsl.forEach(esl => {
    //     console.log("if(" + importLabels[i].macAdres + " == " + esl.pi.macAdres + ") ==>" + (importLabels[i].macAdres == esl.pi.macAdres));
    //     if (importLabels[i].macAdres == esl.pi.macAdres) {
      //       const index = importLabels.indexOf(importLabels[i], 0);
      //       if (index > -1) {
        //         importLabels.splice(index, 1);
        //         console.log("Removed index: " + index);
        //       }
        //     }
        //   });
        // }
