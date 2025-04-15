import { VoucherRulesValidator } from "../app-layer-services/VoucherRulesValidator";
import { APVoucherRepository } from "../data-access-repository/APVoucherRepository";
import { APVoucherRepositoryImp } from "../data-access-repository/APVoucherRepositoryImp";
import { APVoucher } from "../domain-entities/APVoucher";


export class ValidateAPVoucherUsecase {
    private readonly voucherValidator: VoucherRulesValidator
    private readonly voucherRepository: APVoucherRepository

    constructor() {
                this.voucherRepository = new APVoucherRepositoryImp();/*TODO: inject repository*/
                this.voucherValidator = new VoucherRulesValidator(this.voucherRepository);  /*TODO: inject validator*/
    }

    async execute(voucher: APVoucherDTO): Promise<VoucherValidationResponseDTO> {
        const voucherEntity = new APVoucher(voucher);
        const voucherValidationErrors = await this.voucherValidator.validateVoucher(voucherEntity); 
        const isValid = voucherValidationErrors.length === 0;
        const voucherValidationResponseDTO: VoucherValidationResponseDTO = {
            isValid: isValid,
            voucher: voucher,
            errors: voucherValidationErrors
      }
      return voucherValidationResponseDTO;
    }

}   
