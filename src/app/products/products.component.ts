import { Component, OnInit } from '@angular/core';
import { Product } from '../entities/product';
import { ProductService } from '../product.service';
import { MatDialog } from '@angular/material';
import { ProductDetailComponent } from '../product-detail/product-detail.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[];

  constructor(private productService: ProductService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getProducts()
  }

  getProducts(): void {
    this.productService.getProducts().subscribe(products => this.products = products);
  }

  openDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductDetailComponent, {
      data: [product, this.productService]
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getProducts();
    });
  }
}
