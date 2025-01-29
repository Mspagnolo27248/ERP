import { NextFunction, Request, Response } from "express";
import { container } from "../../shared-common/dependency-injection/register-dependencies";
import { withHttpErrorHandling } from "../utility/error-handler";





export class ProductsController {


    @withHttpErrorHandling()
    static async getAll(req: Request, res: Response) {    
            const getProductsUseCase = container.resolve('GetProductUseCase')
            const products = await getProductsUseCase.execute();
            return res.status(201).json(products)    
    }

    @withHttpErrorHandling()
    static async getOne(req: Request, res: Response) {     
            const productID = req.params.id;
            if(!productID) throw new Error("Bad ID")
            const getProductByIdUseCase = container.resolve("GetProductByIdUseCase")
            const products = await getProductByIdUseCase.execute(productID);
            return res.status(201).json(products)
        }   
    

    
}