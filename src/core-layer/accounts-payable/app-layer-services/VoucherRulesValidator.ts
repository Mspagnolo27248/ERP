import { APVoucherRepository } from "../data-access-repository/APVoucherRepository";
import { VoucherValidationResponseDTO } from "../data-transfer-objects/dtos";
import { APVoucher } from "../domain-entities/APVoucher";

export class VoucherRulesValidator {
  constructor(private readonly voucherRepository: APVoucherRepository) {}

  async validateVoucher(voucher: APVoucher): Promise<VoucherValidationResponseDTO> {
    const errors: validationErrors = {};
    await this.validateVoucherNotDuplicate(voucher, errors);
    await this.validateVendorExists(voucher, errors);
    return {
      isValid: Object.keys(errors).length === 0,
      voucher: { ...voucher },
      errors: errors,
    };
  }

  private async validateVoucherNotDuplicate(voucher: APVoucher,errors: validationErrors): Promise<void> {
    if (voucher.voucherNumber) {
      const existing = await this.voucherRepository.findVoucherByVoucherNumber(voucher.voucherNumber);
      if (existing) {
        errors["voucherNumber"] = "Voucher number already exists";
      }
    }
  }

  private async validateVendorExists(voucher: APVoucher,errors: validationErrors): Promise<void> {
    const vendor = await this.voucherRepository.findVendorById(voucher.vendorId);
    if (!vendor) {
      errors["vendorId"] = "Vendor does not exist";
    }
  }
}


interface validationErrors {
  [key: string]: string;
}
