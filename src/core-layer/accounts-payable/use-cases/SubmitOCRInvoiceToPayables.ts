


class SubmitOCRInvoiceToPayables {

    constructor(
        private readonly validateOCRInvoices: ValidateOCRInvoices,
        private readonly voucherRepository: APVoucherRepository
    ) {}    

        async execute(voucher: APVoucherDTO): Promise<VoucherValidationResponseDTO> {
            const voucherValidationResponse = await this.validateVoucher(voucher);
            if(!voucherValidationResponse.isValid) { 
                return voucherValidationResponse;
            }
          const submittedVoucher = await this.submitVoucher(voucherValidationResponse.voucher);
          return {
            isValid: true,
            voucher: submittedVoucher,
            errors: []
          };
            
         
            
       
          
        
     }

     private async validateVoucher(voucher: APVoucherDTO): Promise<VoucherValidationResponseDTO> {
        return await this.validateOCRInvoices.execute(voucher);

     }

     private async submitVoucher(voucher: APVoucherDTO): Promise<APVoucherDTO> {
        return await this.voucherRepository.submitVoucher(voucher);
     }

}



