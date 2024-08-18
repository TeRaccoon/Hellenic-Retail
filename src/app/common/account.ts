export interface Order {
    date: string,
    title: string,
    status: OrderStatus,
    gross_value: number,
    VAT: number,
    total: number,
    payment_status:PaymentStatus,
};

enum OrderStatus {
    Pending = 'Pending',
    Overdue = 'Overdue',
    Complete = 'Complete',
};

enum PaymentStatus {
    Yes = 'Yes',
    No = 'No'
};