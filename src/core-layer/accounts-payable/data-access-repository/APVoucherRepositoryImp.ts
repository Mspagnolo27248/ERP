import { APVoucherRepository } from "./APVoucherRepository";



export class APVoucherRepositoryImp implements APVoucherRepository {


    async findVoucherByVendorId(vendorId: string): Promise<APVoucherDTO[] | null> {
        const vouchers = mockVouchers.filter(voucher => voucher.vendorId === vendorId);
        return vouchers.length > 0 ? vouchers : null;
    }       

    async findVoucherByVoucherNumber(voucherNumber: string): Promise<APVoucherDTO | null> {
        const voucher = mockVouchers.find(voucher => voucher.voucherNumber === voucherNumber);
        return voucher || null;
    }

    async submitVoucher(voucher: APVoucherDTO): Promise<APVoucherDTO> {
        mockVouchers.push(voucher);
        return voucher;
    }

    async findAllVouchers(): Promise<APVoucherDTO[]> {
        return mockVouchers;
    }   
    
    async findVendorById(vendorId: string): Promise<any> {
        return mockVendors.find(vendor => vendor.id === vendorId);
    }

}


const mockVouchers: APVoucherDTO[] = [
    {   
        vendorId: '123',
        voucherNumber: '123',
        amount: 100,
        dueDate: new Date('2021-01-01'),
        discountAmt: 0,
        discountPercent: 0,
        lineItems: [
            {
                lineItemNumber: 1,
                amount: 100,
                description: 'Test'
            }
        ],
    
    }
]

const mockVendors: any[] = [
    {
        id: '123',
        name: 'Test',
        paymentTerms: 'Due on receipt'
    }
]