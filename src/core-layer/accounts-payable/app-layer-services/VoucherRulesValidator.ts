


class VoucherRulesValidator {
    private readonly errors: string[] = [];

    constructor(
        private readonly voucherRepository: APVoucherRepository
    ) {}


    async validateVoucher(voucher: APVoucherDTO): Promise<string[]> {

        this.validateVoucherHasNotBeenPaid(voucher);
        return this.errors;
    }

    private validateVoucherHasNotBeenPaid (voucher: APVoucherDTO): void {
        if(voucher.amount <= 0) {
            this.errors.push('Voucher amount must be greater than 0');
        }
    }
    
    
}

