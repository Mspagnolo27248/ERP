


import { NextFunction, Request, Response } from "express";
import { SubmitOCRInvoiceToPayables } from "../../core-layer/accounts-payable/use-cases/SubmitOCRInvoiceToPayables";
import { ValidateOCRInvoices } from "../../core-layer/accounts-payable/use-cases/ValidateOCRInvoices";
import { APVoucherRepositoryImp } from "../../core-layer/accounts-payable/data-access-repository/APVoucherRepositoryImp";
import { OCRVoucherValidator } from "../../core-layer/accounts-payable/app-layer-services/OCRVoucherValidator";


const voucherRepository = new APVoucherRepositoryImp();
const ocrValidator = new OCRVoucherValidator(voucherRepository);
const validateOCRInvoices = new ValidateOCRInvoices(ocrValidator, voucherRepository);
const submitOCRInvoiceToPayables = new SubmitOCRInvoiceToPayables(validateOCRInvoices, voucherRepository);

export class APVoucherController {

    static async validateOCRInvoice(req: Request, res: Response, next: NextFunction) {
        const   voucher = await validateOCRInvoices.execute(req.body);
        if(voucher.isValid) {
            return res.status(200).json(voucher);
        } else {
            return res.status(400).json(voucher);
        }
    }

    static async submitOCRInvoice(req: Request, res: Response, next: NextFunction) {
        const   voucher = await submitOCRInvoiceToPayables.execute(req.body);
        if(voucher.isValid) {
            return res.status(200).json(voucher);
        } else {
            return res.status(400).json(voucher);
        }
    }
}
