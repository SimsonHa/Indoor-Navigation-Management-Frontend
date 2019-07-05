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

  // toJson() : String {
  //   //return JSON.Stringify(this);
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
