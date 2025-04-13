



class OCRVoucherValidator {
    private readonly voucherRepository: APVoucherRepository;
    private readonly voucherRulesValidator: VoucherRulesValidator;
    private readonly errors: string[] = [];
    constructor(
        voucherRepository: APVoucherRepository,
    ) {
        this.voucherRepository = voucherRepository;
        this.voucherRulesValidator = new VoucherRulesValidator(this.voucherRepository);
    }   

    async validateVoucher(voucher: APVoucherDTO): Promise<string[]> {
        const errors = await this.voucherRulesValidator.validateVoucher(voucher);
        await this.validateOcrRules(voucher);
        return errors;
    }

    async validateOcrRules(voucher: APVoucherDTO): Promise<string[]> {      
        this.validateOCRQuantityFields(voucher);
        return this.errors;
    }

    private validateOCRQuantityFields(voucher: APVoucherDTO): void {
        if(voucher.lineItems.length < 999999) {
            this.errors.push('Quantity must be greater than 0') ;
        }
    }


}   
