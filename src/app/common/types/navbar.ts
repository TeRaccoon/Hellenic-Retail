export interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: number;
    retail_box_price?: number;
    box_price?: number;
    pallet_price?: number;
    pallet_size?: number;
    box_size: number;
    offer_start: Date | null;
    offer_end: Date | null;
    discount: number;
    image_location: string | null;
    quantity: number;
}