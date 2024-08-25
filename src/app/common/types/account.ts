export interface Order {
    date: string,
    title: string,
    status: OrderStatus,
    gross_value: number,
    VAT: number,
    total: number,
    payment_status: PaymentStatus,
};

export enum OrderStatus {
    Pending = 'Pending',
    Overdue = 'Overdue',
    Complete = 'Complete',
};

enum PaymentStatus {
    Yes = 'Yes',
    No = 'No'
};

export interface RegistrationForm {
    action: 'create-account',
    email: string,
    forename: string,
    password?: string,
    passwordRepeat?: string,
    phone?: string,
    promoConsent: boolean,
    surname: string,
    table_name: 'customers',
    termsAndConditions: boolean
};

export interface AccountResponse {
    success: boolean,
    message: string,
    data?: string
};