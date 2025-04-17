export interface APVoucherDTO {
    vendorId: string;
    voucherNumber?: string;
    amount: number;
    dueDate: Date;
    lineItems:  APVoucherLineItemDTO[];
    discountAmt: number;
    discountPercent: number;
}

export interface APVoucherLineItemDTO {
    lineItemNumber: number;
    amount: number;
    description: string;
}

export interface OCRVoucherHeaderDTO {
    vendorId: string;
    voucherNumber: string;
    amount: number;
    dueDate: Date;
}

export interface OCRVoucherLineItemDTO {
    lineItemNumber: number;
    amount: number;
    description: string;
}


export interface VoucherValidationResponseDTO {
    isValid: boolean;
    voucher: APVoucherDTO;
    errors: Record<string, string>;
}
