import { Router } from "express";
import { APVoucherController } from "../controllers/ap-voucher.controller";



const apVoucherRoutes = Router();   
apVoucherRoutes.post('/', APVoucherController.submitAPVoucher);
apVoucherRoutes.post('/validate', APVoucherController.validateAPVoucher);
apVoucherRoutes.post('/flexi-invoice/validate', APVoucherController.validateFlexiInvoice);
apVoucherRoutes.post('/flexi-invoice/submit', APVoucherController.submitFlexiInvoice);

export default apVoucherRoutes;
