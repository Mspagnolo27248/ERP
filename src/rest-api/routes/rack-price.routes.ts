import  { Router, Request, Response, NextFunction } from "express";
import { checkBodyMiddleware, RackPriceController } from "../controllers/rack-price-controller";



//URI: /rack-price

const rackPriceRoutes = Router();
rackPriceRoutes.get("/", RackPriceController.getAll); 
rackPriceRoutes.get("/:id", checkBodyMiddleware,RackPriceController.getOne); 
rackPriceRoutes.post('/',  checkBodyMiddleware, RackPriceController.upsert);
rackPriceRoutes.put('/:id',checkBodyMiddleware, RackPriceController.upsert);
rackPriceRoutes.delete('/',checkBodyMiddleware, RackPriceController.delete);
export default rackPriceRoutes;
