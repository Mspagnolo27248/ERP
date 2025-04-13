




interface APVoucherRepository {
        findVocherByVendorId(vendorId: string): Promise<APVoucherDTO[]|null>;
        findVoucherByVoucherNumber(voucherNumber: string): Promise<APVoucherDTO|null>;
        submitVoucher(voucher: APVoucherDTO): Promise<APVoucherDTO>;
        findAllVouchers(): Promise<APVoucherDTO[]>;

}
