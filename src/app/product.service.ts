import { Injectable } from '@angular/core';
import { Product } from './entities/product';
import { PRODUCTS } from './mocks/product-mocks';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(PRODUCTS);
  }

  getProduct(id: number): Observable<Product> {
    return of(PRODUCTS.find(product => product.id === id));
  }

  saveProduct(product : Product) {
    //push product to DB here
    console.log("Saved "+ product.name + " with ID " + product.id);
  }
}
