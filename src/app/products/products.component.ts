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

  drag(event : DragEvent, product : Product) {
    // console.log("Drag in product.component.ts w/o data --------------------------------")
    // console.log(event);
    // event.dataTransfer.dropEffect = "link";
    // event.dataTransfer.setData("any", "label.id.toString()");
    // console.log("Drag in product.component.ts w/ data --------------------------------")
    // console.log(event);
    this.productService.setDraggedLast(product);
  }

  drop(event : DragEvent) {
    // console.log("Drop in product.component.ts --------------------------------")
    // console.log(event)

  }
}
