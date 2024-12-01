export interface Product {
  name: string;
  retail_price: number;
  wholesale_price: number;
  box_price: number;
  retail_box_price: number;
  pallet_price: number;
  discount: number;
  image_location: string;
}

export interface ProductDetails {
  id: number;
  category: string;
  sub_category: string;
  description: string;
  brand: string;
  discount: number;
  name: string;
  price: number;
  discounted_price: number;
  discounted_retail_box_price?: number;
  discounted_box_price?: number;
  discounted_pallet_price?: number;
  box_price?: number;
  retail_box_price?: number;
  pallet_price?: number;
  box_size?: number;
  pallet_size?: number;
}
