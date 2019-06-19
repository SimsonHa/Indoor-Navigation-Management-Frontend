import { Label } from './label';

export class Product {
  id: number;
  name: string;
  price: number;
  artNr: string;
  category: string;
  label: Label | any;
}
