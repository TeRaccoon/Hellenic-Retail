export interface CartItem {
  id: number | null;
  item_id: number;
  item_name: string;
  quantity: number;
  unit: CartUnit;
}

export enum CartUnit {
  Unit = 'Unit',
  Box = 'Box',
  Pallet = 'Pallet',
  RetailBox = 'Retail Box',
}
export interface CartProduct {
  name: string;
  price: number;
  discounted_price: number;
  discount: number;
  image_location: string;
}
