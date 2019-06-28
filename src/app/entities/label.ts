import { Product } from './product';

export class Label {
  id: number;
  mac: string;
  x: number;
  y: number;
  product: Product = null;

  static labelCount = 0;

  constructor(mac : string, x : number, y : number) {
    //set id later in DB
    this.id = Label.labelCount++;
    this.mac = mac;
    this.x = x;
    this.y = y;
  }

  getId(): number {
    return this.id;
  }

  getMac(): String {
    return this.mac;
  }

  setX(x : number) {
    this.x = x;
  }

  getX(): number {
    return this.x;
  }

  setY(y: number) {
    this.y = y;
  }

  getY(): number {
    return this.y;
  }

  setProduct(product: Product) {
    this.product = product;
  }

  getProduct(): Product {
    return this.product;
  }
}
