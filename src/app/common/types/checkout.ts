import { OrderStatus } from 'src/app/common/types/account';

export interface CheckoutSummary {
  subtotal: number;
  delivery: number;
  vat: number;
  total: number;
  discount: Discount | null;
}

export interface Discount {
  title: string;
  value: number;
}

export enum PaymentMethod {
  Barclays = 'Barclays',
  PayPal = 'PayPal',
}

export interface CheckoutFormFull {
  forename: string;
  surname: string;
  company?: string;
  address: string;
  address_two?: string;
  city: string;
  county?: string;
  postcode: string;
  email: string;
  card_number: string;
  expiry_month: string;
  expiry_year: string;
  CVC: string;
  order_notes?: string;
}

export interface InvoiceForm {
  title: string;
  customer_id: number;
  status: OrderStatus.Pending;
  delivery_date?: Date;
  printed: YesNo.No;
  gross_value: number;
  VAT: number;
  total: number;
  outstanding_balance: number;
  delivery_type: DeliveryType;
  payment_status: YesNo.Yes;
  warehouse_id?: number;
  notes?: string;
  address_id: number;
  billing_address_id: number;
  postcode: string;
  table_name: 'invoices';
  action: 'add';
}

export enum YesNo {
  Yes = 'Yes',
  No = 'No',
}

export enum DeliveryType {
  Collection = 'Collection',
  Delivery = 'Delivery',
}

export interface Coupon {
  id: number;
  value: number;
  type: CouponType | null;
  name: string;
  active: YesNo;
  amount: number | null;
  customer_id: number | null;
  offer_code: string;
  offer_start: Date | null;
  offer_end: Date | null;
  quantity_limit: number | null;
}

export enum CouponType {
  Percentage = 'Percentage',
  Amount = 'Amount',
}
