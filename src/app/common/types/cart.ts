export interface CartItem {
    id: number,
    item_id: number,
    item_name: string,
    quantity: number,
    unit: CartUnit
};

export enum CartUnit {
    Unit = 'Unit',
    Box = 'Box',
    Pallet = 'Pallet'
};
export interface CartProduct {
    name: string,
    price: number,
    discounted_price: number,
    discount: number,
    image_location: string,
};