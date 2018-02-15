import { BillDetail } from "./bill-detail.model";

export interface Bill {
    Id?: number;
    CustomerId?: string;
    CustomerName?: string;
    CustomerAddress?: string;
    CustomerMobile?: string;
    CustomerMessage?: string;
    PaymentMethod?: any;
    BillStatus?: any;
    DateCreated?: any;
    Status?: boolean;
    Selected?: boolean;
    BillDetails: BillDetail[];
    BillStatusName?: Promise<string>;
    PaymentMethodName?: Promise<string>;
}