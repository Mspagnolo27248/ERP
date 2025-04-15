import { APVoucherRepository } from "../data-access-repository/APVoucherRepository";
import { APVoucher } from "../domain-entities/APVoucher";



export class VoucherRulesValidator {
    private readonly errors: string[] = [];

    constructor(
        private readonly voucherRepository: APVoucherRepository
    ) {}

    async validateVoucher(voucher: APVoucher): Promise<string[]> {

        this.validateVoucherHasNotBeenPaid(voucher);
        return this.errors;
    }

    private validateVoucherHasNotBeenPaid (voucher: APVoucher): void {
        if(voucher.amount <= 0) {
            this.errors.push('Voucher amount must be greater than 0');
        }
    }
    
    
}

