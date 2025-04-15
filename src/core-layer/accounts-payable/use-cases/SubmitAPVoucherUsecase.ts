import { VoucherRulesValidator } from "../app-layer-services/VoucherRulesValidator";
import { APVoucherRepository } from "../data-access-repository/APVoucherRepository";
import { APVoucherRepositoryImp } from "../data-access-repository/APVoucherRepositoryImp";
import { APVoucher } from "../domain-entities/APVoucher";




export class SubmitAPVoucherUsecase {
    private readonly voucherRepository: APVoucherRepository;
    private readonly voucherValidator: VoucherRulesValidator;

    constructor(
   
    ) {
        this.voucherRepository = new APVoucherRepositoryImp();/*TODO: inject repository*/
        this.voucherValidator = new VoucherRulesValidator(this.voucherRepository);  /*TODO: inject validator*/
    }

    async execute(voucher: APVoucherDTO): Promise<VoucherValidationResponseDTO> {   
        const voucherEntity = new APVoucher(voucher);   
        const errors = await this.voucherValidator.validateVoucher(voucherEntity);
        const isValid = errors.length === 0;
        if(isValid){
             this.voucherRepository.submitVoucher(voucher);
        }
        return {
            isValid: isValid,
            voucher: voucher,
            errors: errors
        }
    }

}
