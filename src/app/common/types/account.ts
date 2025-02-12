import { YesNo } from './checkout';

export interface Order {
  date: string;
  title: string;
  status: OrderStatus;
  gross_value: number;
  VAT: number;
  total: number;
  payment_status: PaymentStatus;
}

export enum OrderStatus {
  Pending = 'Pending',
  Overdue = 'Overdue',
  Complete = 'Complete',
}

enum PaymentStatus {
  Yes = 'Yes',
  No = 'No',
}

export interface RegistrationForm {
  action: 'create-account';
  businessRequest: boolean;
  email: string;
  forename: string;
  password?: string;
  passwordRepeat?: string;
  phone?: string;
  promoConsent: boolean;
  surname: string;
  pending_approval: YesNo;
  table_name: 'customers';
  termsAndConditions: boolean;
}

export enum CustomerType {
  Retail = 'Retail',
  Wholesale = 'Wholesale',
}

export enum Bitwise {
  No = 0,
  Yes = 1,
}

export interface AccountResponse {
  success: boolean;
  message: string;
  data?: string;
}

export interface CustomerDetails {
  forename: string;
  surname: string;
  email: string;
  phone_number_primary: string;
  phone_number_secondary: string;
  pending_approval: YesNo;
  subscribed: Bitwise;
}
