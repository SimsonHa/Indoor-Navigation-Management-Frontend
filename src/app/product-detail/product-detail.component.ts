import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Product } from '../entities/product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  @Input() product: Product;
  productService: ProductService;

  constructor(
    public dialogRef: MatDialogRef<ProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[]) {
    this.product = data[0];
    this.productService = data[1];
  }

  ngOnInit(): void {
    console.log("Seleceted Product: " + this.product.name);
  }

  onSubmit(product: Product): void {
    console.log("Submitted" + product);
    this.productService.saveProduct(product);
  }

  close(warn: boolean): void {

    if (warn) {
      alert("Changes will not be saved");
    }
    this.dialogRef.close();
  }
}
