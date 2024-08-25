export interface Order {
    date: string,
    title: string,
    status: OrderStatus,
    gross_value: number,
    VAT: number,
    total: number,
    payment_status: PaymentStatus,
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

export interface RegistrationForm {
    action: string,
    email: string,
    forename: string,
    password: string,
    passwordRepeat?: string,
    phone: string,
    promoConsent: boolean,
    surname: string,
    table_name: string,
    termsAndConditions: boolean
};

export interface AccountResponse {
    success: boolean,
    message: string
};