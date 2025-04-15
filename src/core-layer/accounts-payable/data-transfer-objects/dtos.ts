interface APVoucherDTO {
    vendorId: string;
    voucherNumber: string;
    amount: number;
    dueDate: Date;
    lineItems:  APVoucherLineItemDTO[];
    discountAmt: number;
    discountPercent: number;
}

interface APVoucherLineItemDTO {
    lineItemNumber: number;
    amount: number;
    description: string;
}

interface OCRVoucherHeaderDTO {
    vendorId: string;
    voucherNumber: string;
    amount: number;
    dueDate: Date;
}

interface OCRVoucherLineItemDTO {

    lineItemNumber: number;
    amount: number;
    description: string;

}


interface VoucherValidationResponseDTO {
    isValid: boolean;
    voucher: APVoucherDTO;
    errors: string[];
}
