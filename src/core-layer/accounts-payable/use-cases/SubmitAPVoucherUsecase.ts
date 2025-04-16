import { VoucherRulesValidator } from "../app-layer-services/VoucherRulesValidator";
import { APVoucherRepository } from "../data-access-repository/APVoucherRepository";
import { APVoucherRepositoryImp } from "../data-access-repository/APVoucherRepositoryImp";
import { APVoucher } from "../domain-entities/APVoucher";

export class SubmitAPVoucherUsecase {
  private readonly voucherRepository: APVoucherRepository;
  private readonly voucherValidator: VoucherRulesValidator;

  constructor() {
    this.voucherRepository = new APVoucherRepositoryImp(); /*TODO: inject repository*/
    this.voucherValidator = new VoucherRulesValidator(this.voucherRepository); /*TODO: inject validator*/
  }

  async execute(voucher: APVoucherDTO): Promise<VoucherValidationResponseDTO> {
    let isValid = false;
    let errors: string[] = [];
    try {
      const voucherEntity = new APVoucher(voucher);
      errors = await this.voucherValidator.validateVoucher(voucherEntity);
      isValid = errors.length === 0;
      if (isValid) {
        this.voucherRepository.submitVoucher(voucher);
      }
    } catch (error) {
      throw new Error("An unknown error occurred");
    }
    return {
      isValid: isValid,
      voucher: voucher,
      errors: errors,
    };
  }
}

async function withErrorHandling(func: () => Promise<any>) {
  try {
    return await func();
  } catch (error) {
    if (error instanceof Error) {
      error.name = "UseCaseError";
      throw error;
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}
