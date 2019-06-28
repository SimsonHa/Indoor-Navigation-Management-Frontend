import { Label } from './label';

export class Product {
  id: number;
  name: string;
  price: number;
  artNr: string;
  category: string;
  label: Label | null;

  static productCount = 0;

  constructor(name : string, price : number, artNr : string, category : string) {
      this.id = Product.productCount++;
      this.name = name;
      this.price = price;
      this.artNr = artNr;
      this.category = category;
  }

  getId() : number {
    return this.id;
  }

  getName() : string {
    return this.name;
  }

  setLabel(label : Label) {
    this.label = label;
  }

  getLabel() : Label {
    return this.label;
  }
}
