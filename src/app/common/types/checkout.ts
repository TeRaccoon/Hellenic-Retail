export interface CheckoutSummary {
    subtotal: number,
    delivery: number,
    vat: number,
    total: number
}

export enum PaymentMethod {
    Barclays = 'Barclays',
    PayPal = 'PayPal'
}