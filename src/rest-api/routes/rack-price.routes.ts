import  { Router, Request, Response, NextFunction } from "express";
import { checkBodyMiddleware, RackPriceController } from "../controllers/rack-price-controller";

/*
**** <RESOURCE>routes.TS  Defines the specific Resource URI endpoints ***
Notes:
- Instantiate a router for the resource.
- specifcy the HTTP verbs to implement and their corresponding paths.
- Import the Controller for the resource.
- this file should not have an implementation details!
*/ 

//Resource: RackPrice  BasePath: /rack-price
const rackPriceRoutes = Router();
rackPriceRoutes.get("/", RackPriceController.getAll); 
rackPriceRoutes.get("/:id",RackPriceController.getOne);  
rackPriceRoutes.post('/',  checkBodyMiddleware, RackPriceController.upsert);  
rackPriceRoutes.delete('/',RackPriceController.delete);
// rackPriceRoutes.put('/:id',checkBodyMiddleware, RackPriceController.upsert);    


export default rackPriceRoutes;
