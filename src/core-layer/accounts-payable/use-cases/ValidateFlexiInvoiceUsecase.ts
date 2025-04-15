import { OCRVoucherValidator } from "../app-layer-services/OCRVoucherValidator";
import { APVoucherRepository } from "../data-access-repository/APVoucherRepository";
import { APVoucher } from "../domain-entities/APVoucher";




export class ValidateOCRInvoices {

    constructor(
        private readonly ocrVoucherValidator: OCRVoucherValidator,
        private readonly voucherRepository: APVoucherRepository 
    ) {
        this.ocrVoucherValidator = new OCRVoucherValidator(this.voucherRepository);
    }

    async execute(voucher: APVoucherDTO): Promise<VoucherValidationResponseDTO> {
        const voucherEntity = new APVoucher(voucher);
        const errors = await this.ocrVoucherValidator.validateVoucher(voucherEntity)
        const isValid = errors.length === 0;
        return {
            isValid: isValid,
            voucher: voucher,
            errors: errors
        };
    }
}