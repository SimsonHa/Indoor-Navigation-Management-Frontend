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

  // getId(): number {
  //   return this.id;
  // }

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

  // setTransform(transform : Transform) {
  //   this.transform = transform;
  // }
  //
  // getTransform() : Transform {
  //   return this.transform;
  // }
  //
  // toJson() : String {
  //   // return JSON.stringify(this);
  //   // Note: cache should not be re-used by repeated calls to JSON.stringify.
  //   var cache = [];
  //   let json : String = JSON.stringify(this, function(key, value) {
  //       if (typeof value === 'object' && value !== null) {
  //           if (cache.indexOf(value) !== -1) {
  //               // Duplicate reference found, discard key
  //               return;
  //           }
  //           // Store value in our collection
  //           cache.push(value);
  //       }
  //       return value;
  //   });
  //   cache = null; // Enable garbage collection
  //   return json;
  // }
}
