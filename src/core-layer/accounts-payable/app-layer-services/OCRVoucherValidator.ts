import { APVoucherRepository } from "../data-access-repository/APVoucherRepository";
import { APVoucher } from "../domain-entities/APVoucher";
import { VoucherRulesValidator } from "./VoucherRulesValidator";




export class OCRVoucherValidator {
    private readonly voucherRepository: APVoucherRepository;
    private readonly voucherRulesValidator: VoucherRulesValidator;
    private readonly errors: string[] = [];
    constructor(
        voucherRepository: APVoucherRepository,
    ) {
        this.voucherRepository = voucherRepository;
        this.voucherRulesValidator = new VoucherRulesValidator(this.voucherRepository);
    }   

    async validateVoucher(voucher: APVoucher): Promise<string[]> {
        const errors = await this.voucherRulesValidator.validateVoucher(voucher);
        await this.validateOcrRules(voucher);
        return errors;
    }

    async validateOcrRules(voucher: APVoucher): Promise<string[]> {      
        this.validateOCRQuantityFields(voucher);
        return this.errors;
    }

    private validateOCRQuantityFields(voucher: APVoucher): void {
        if(voucher.lineItems.length < 999999) {
            this.errors.push('Quantity must be greater than 0') ;
        }
    }


}   
