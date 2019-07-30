import { Injectable } from '@angular/core';
import { Product } from './entities/product';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  //for drag and drop impl
  draggedLast: Product = null;

  products: Product[] = [];

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    this.http.get<JSON>("http://localhost:8080/artikel", this.httpOptions).subscribe(text => {
      let importProducts: ImportProduct[] = JSON.parse(JSON.stringify(text));

      this.products = [];
      importProducts.forEach(iP => {
        this.products.push(new Product(iP.id, iP.name, iP.preis, iP.artNr, iP.kategorie.name));
      });
    });
    return of(this.products);
  }

  getProduct(id: number): Observable<Product> {
    return of(this.products.find(product => product.id === id));
  }

  saveProduct(product: Product) {
    this.http.post<String>("http://localhost:8080/newArtikel", this.stringifyProduct(product), this.httpOptions).subscribe(art => {
      this.getProducts();
    });
}

setDraggedLast(product : Product) {
  this.draggedLast = product;
}

getDraggedLast() : Product {
  return this.draggedLast;
}

//again poorly done json parsing
stringifyProduct(product : Product) : String {
  let json: String = JSON.stringify(product);
  json = json.replace("price", "preis");
  json = json.replace("category", "kategorie\":{\"name");
  json += "}";
  console.log(json);
  return json;
}
}
