import { Injectable } from '@angular/core';
import { Product } from './entities/product';
import { LabelService } from './label.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  draggedLast : Product = null;

  //mock daten
  products : Product[] = [
    new Product("Apfel", 1.29, "34r34rgf5erz", "Obst"),
    new Product("Birne", 0.55, "35r34rgf5erz", "Obst"),
    new Product("Tomate", 0.99, "36r34rgf5erz", "Gemüse"),
    new Product("Kartoffeln", 2.29, "37r34rgf5erz", "Gemüse"),
    new Product("Spülmittel", 3.29, "34834rgf5erz", "Haushaltswaren"),
    new Product("Lappen", 1.89, "36534rgf5erz", "Haushaltswaren"),
  ]

  constructor(private labelService : LabelService) { }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProduct(id: number): Observable<Product> {
    return of(this.products.find(product => product.id === id));
  }

  saveProduct(product : Product) {
    //push product to DB here
    console.log("Saved "+ product.name + " with ID " + product.id);
  }

  setDraggedLast(product : Product) {
    this.draggedLast = product;
  }

  getDraggedLast() : Product {
    return this.draggedLast;
  }
  //product auto connect to available labels (mocking here atm)
  //when product is dropped to visual editor
  // conntectProductLabel(product : Product) {
  //   if(!product.label) {
  //     this.labelService.getPrioLabel().subscribe(label => product.setLabel(label));
  //     console.log("Connected")
  //   }
  // }
}
