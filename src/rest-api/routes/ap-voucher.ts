import { Router } from "express";
import { APVoucherController } from "../controllers/ap-voucher.controller";



const apVoucherRoutes = Router();   
apVoucherRoutes.post('/ocr-invoice/validate', APVoucherController.validateOCRInvoice);
apVoucherRoutes.post('/ocr-invoice', APVoucherController.submitOCRInvoice);

export default apVoucherRoutes;
