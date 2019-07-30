export class Product {
  id: number;
  name: String;
  price: number;
  artNr: String;
  category: String;
  static productCount = 0;

  constructor(id : number, name : String, price : number, artNr : String, category : String) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.artNr = artNr;
      this.category = category;
  }

  static generateId() : number {
    //this is not save - generate ID in DB in next Version
    return Product.productCount++;
  }

  getId() : number {
    return this.id;
  }

  getName() : String {
    return this.name;
  }

  getCategory() : String {
    return this.category;
  }
}
