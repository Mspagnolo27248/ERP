



class ValidateOCRInvoices {

    constructor(
        private readonly ocrVoucherValidator: OCRVoucherValidator,
        private readonly voucherRepository: APVoucherRepository
    ) {
        this.ocrVoucherValidator = new OCRVoucherValidator(this.voucherRepository);
    }

    async execute(voucher: APVoucherDTO): Promise<VoucherValidationResponseDTO> {
        const errors = await this.ocrVoucherValidator.validateVoucher(voucher)
        const isValid = errors.length === 0;
        return {
            isValid: isValid,
            voucher: voucher,
            errors: errors
        };
    }
}