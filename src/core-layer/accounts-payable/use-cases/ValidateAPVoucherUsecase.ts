import { VoucherRulesValidator } from "../app-layer-services/VoucherRulesValidator";
import { APVoucherRepository } from "../data-access-repository/APVoucherRepository";
import { APVoucherRepositoryImp } from "../data-access-repository/APVoucherRepositoryImp";
import { APVoucher } from "../domain-entities/APVoucher";
import { APVoucherDTO, VoucherValidationResponseDTO } from "../data-transfer-objects/dtos";

export class ValidateAPVoucherUsecase {
    private readonly voucherValidator: VoucherRulesValidator
    private readonly voucherRepository: APVoucherRepository

    constructor() {
                this.voucherRepository = new APVoucherRepositoryImp();/*TODO: inject repository*/
                this.voucherValidator = new VoucherRulesValidator(this.voucherRepository);  /*TODO: inject validator*/
    }

    async execute(voucherDTO: APVoucherDTO): Promise<VoucherValidationResponseDTO> {
        try {
            const voucherEntity = new APVoucher(voucherDTO);
            return await this.voucherValidator.validateVoucher(voucherEntity);
        } catch (error: unknown) {
            return {
                isValid: false,
                voucher: voucherDTO,
                errors: error instanceof Error ?{[error.name]: error.message} : {voucherNumber: 'Unknown error'}
            };
        }
    }
}   
