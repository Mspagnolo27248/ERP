


export class APVoucher {
    public readonly vendorId: string;
    public readonly amount: number;
    public readonly dueDate: Date;
    public readonly lineItems: APVoucherLineItem[];
    public readonly discountAmt: number;
    public readonly discountPercent: number;
    public readonly voucherNumber?: string;

    constructor(props: APVoucherProps) {
        this.vendorId = props.vendorId;
        this.amount = props.amount;
        this.dueDate = props.dueDate;
        this.lineItems = props.lineItems;
        this.discountAmt = props.discountAmt;
        this.discountPercent = props.discountPercent;
        this.voucherNumber = props.voucherNumber;
        
        this.validateEntity();
    }

    validateEntity() {
        this.validateDetailSumToHeader();
        this.validateDiscount();
    }

    validateDetailSumToHeader() {
        const totalDetailAmount = this.lineItems.reduce((acc, item) => acc + item.amount, 0);
        if (totalDetailAmount !== this.amount) {
            throwDomainValidationException('amount', 'Detail sum to header mismatch');
        }
    }

    validateDiscount() {
        if(this.discountAmt && this.discountPercent){
            throwDomainValidationException('discountAmt', 'Discount amount and discount percent cannot both be provided');
        }
     
        if (this.discountAmt > this.amount) {
            throwDomainValidationException('discountAmt', 'Discount amount is greater than the total amount');
        }

        if(this.discountPercent && this.discountPercent > 100){
            throwDomainValidationException('discountPercent', 'Discount percent is greater than 100');
        }
    }
}

class APVoucherLineItem {
    constructor(
        public readonly lineItemNumber: number,
        public readonly amount: number,
        public readonly description: string
    ) {}
}



interface APVoucherProps {
    vendorId: string;
    amount: number;
    dueDate: Date;
    lineItems: APVoucherLineItem[];
    discountAmt: number;
    discountPercent: number;
    voucherNumber?: string;
}

function throwDomainValidationException(property: string, message: string) {
    const error = new Error(message);   
    error.name = property   ;
    throw error;
}
