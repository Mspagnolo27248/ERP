



class APVoucher {

    constructor(
        public readonly vendorId: string,
        public readonly voucherNumber: string,
        public readonly amount: number,
        public readonly dueDate: Date,
        public readonly lineItems: APVoucherLineItem[],
        public readonly discountAmt:number,
        public readonly discountPercent:number
    ) {
        this.validateEntity();
    }


    validateEntity() {
        this.validateDetailSumToHeader();
        this.validateDiscount();
    }

    validateDetailSumToHeader() {
        const totalDetailAmount = this.lineItems.reduce((acc, item) => acc + item.amount, 0);
        if (totalDetailAmount !== this.amount) {
            throw new Error('Detail sum to header mismatch');
        }
    }

    validateDiscount() {

        if(this.discountAmt && this.discountPercent){
            throw new Error('Discount amount and discount percent cannot both be provided');
        }
     
        if (this.discountAmt > this.amount) {
            throw new Error('Discount amount is greater than the total amount');
        }

        if(this.discountPercent && this.discountPercent > 100){
            throw new Error('Discount percent is greater than 100');
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

