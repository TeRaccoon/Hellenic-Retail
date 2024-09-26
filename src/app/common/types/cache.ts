export interface Category {
  id: number;
  name: string;
  image_location: string;
}

export interface SubCategory {
  category_id: number;
  name: string;
}
