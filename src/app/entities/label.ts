import { Product } from './product';

export class Label {
  //id: number;
  macAdres: String; //[sic]
  posX: number;
  posY: number;
  artikel: Product = null;
  // transform : Transform = null;

  static labelCount = 0;

  constructor(mac : String, x : number, y : number) {
    //set id later in DB
    //this.id = Label.labelCount++;
    this.macAdres = mac;
    this.posX = x;
    this.posY = y;
  }

  getMac(): String {
    return this.macAdres;
  }

  setX(x : number) {
    this.posX = x;
  }

  getX(): number {
    return this.posX;
  }

  setY(y: number) {
    this.posY = y;
  }

  getY(): number {
    return this.posY;
  }

  setProduct(product: Product) {
    this.artikel = product;
  }

  getProduct(): Product {
    return this.artikel;
  }
}
