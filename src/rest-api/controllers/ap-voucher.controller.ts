


import { NextFunction, Request, Response } from "express";
import { ValidateOCRInvoices } from "../../core-layer/accounts-payable/use-cases/ValidateFlexiInvoiceUsecase";
import { APVoucherRepositoryImp } from "../../core-layer/accounts-payable/data-access-repository/APVoucherRepositoryImp";
import { OCRVoucherValidator } from "../../core-layer/accounts-payable/app-layer-services/OCRVoucherValidator";
import { SubmitFlexiInvoiceUsecase } from "../../core-layer/accounts-payable/use-cases/SubmitFlexiInvoiceUsecase";
import { ValidateAPVoucherUsecase } from "../../core-layer/accounts-payable/use-cases/ValidateAPVoucherUsecase";
import { SubmitAPVoucherUsecase } from "../../core-layer/accounts-payable/use-cases/SubmitAPVoucherUsecase";
import { withHttpErrorHandling } from "../utility/error-handler";

const voucherRepository = new APVoucherRepositoryImp();
const ocrValidator = new OCRVoucherValidator(voucherRepository);
const validateFlexiInvoice = new ValidateOCRInvoices(ocrValidator, voucherRepository);
const submitFlexiInvoiceUsecase = new SubmitFlexiInvoiceUsecase(validateFlexiInvoice, voucherRepository);

export class APVoucherController {

    @withHttpErrorHandling()
    static async validateAPVoucher(req: Request, res: Response, next: NextFunction) {
        const voucher = req.body;
        const validateAPVoucherUsecase = new ValidateAPVoucherUsecase();//TODO: inject repository
        const response = await validateAPVoucherUsecase.execute(voucher);
        if(response.isValid) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    }

    @withHttpErrorHandling()
    static async submitAPVoucher(req: Request, res: Response, next: NextFunction) {
        const voucher = req.body;
        const submitAPVoucherUsecase = new SubmitAPVoucherUsecase();//TODO: inject repository
        const response = await submitAPVoucherUsecase.execute(voucher);
        if(response.isValid) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    }

    @withHttpErrorHandling()
    static async validateFlexiInvoice(req: Request, res: Response, next: NextFunction) {
        const   voucher = await validateFlexiInvoice.execute(req.body);
        if(voucher.isValid) {
            return res.status(200).json(voucher);
        } else {
            return res.status(400).json(voucher);
        }
    }

    @withHttpErrorHandling()
    static async submitFlexiInvoice(req: Request, res: Response, next: NextFunction) {
        const   voucher = await submitFlexiInvoiceUsecase.execute(req.body);
        if(voucher.isValid) {
            return res.status(200).json(voucher);
        } else {
            return res.status(400).json(voucher);
        }
    }
}
