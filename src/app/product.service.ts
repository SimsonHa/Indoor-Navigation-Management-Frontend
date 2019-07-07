import { Injectable } from '@angular/core';
import { Product } from './entities/product';
import { LabelService } from './label.service';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  draggedLast: Product = null;

  //mock daten
  products: Product[] = []
  //   new Product(Product.generateId(), "Apfel", 1.29, "34r34rgf5erz", "Obst"),
  //   new Product("Birne", 0.55, "35r34rgf5erz", "Obst"),
  //   new Product("Tomate", 0.99, "36r34rgf5erz", "Gemüse"),
  //   new Product("Kartoffeln", 2.29, "37r34rgf5erz", "Gemüse"),
  //   new Product("Spülmittel", 3.29, "34834rgf5erz", "Haushaltswaren"),
  //   new Product("Lappen", 1.89, "36534rgf5erz", "Haushaltswaren"),
  // ]

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private labelService: LabelService, private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    this.http.get<JSON>("http://localhost:8080/artikel", this.httpOptions).subscribe(text => {
      let importProducts: ImportProduct[] = JSON.parse(JSON.stringify(text));

      this.products = [];
      importProducts.forEach(iP => {
        this.products.push(new Product(iP.id, iP.name, iP.preis, iP.artNr, iP.kategorie.name));
        console.log(":.................")
        console.log(this.products[this.products.length -1]);
      });
    });
    return of(this.products);
  }

  getProduct(id: number): Observable<Product> {
    return of(this.products.find(product => product.id === id));
  }

  saveProduct(product: Product) {
    //push product to DB here
    // this.products.push(product);
    this.http.post<String>("http://localhost:8080/newArtikel", this.stringifyProduct(product), this.httpOptions).subscribe(art => {
      this.getProducts();
    });
  // console.log(this.stringifyProduct(product));
  // console.log(JSON.stringify(product));
}

setDraggedLast(product : Product) {
  this.draggedLast = product;
}

getDraggedLast() : Product {
  return this.draggedLast;
}

stringifyProduct(product : Product) : String {
  let json: String = JSON.stringify(product);
  json = json.replace("price", "preis");
  json = json.replace("category", "kategorie\":{\"name");
  json += "}";
  console.log(json);
  return json;
}
}
