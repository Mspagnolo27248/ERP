import { NextFunction, Request, Response } from "express";
import { container } from "../../shared-common/dependancy-injection/registar-dependanies";





export class ProductsController {

    static async getAll(req: Request, res: Response) {
        try {
            const getProductsUseCase = container.resolve('GetProductUseCase')
            const products = await getProductsUseCase.execute();
            return res.status(201).json(products)
        }
        catch (err) {
            return res.status(500).json({ message: "Error" });
        }
    }


    static async getOne(req: Request, res: Response) {
        try {
            const productID = req.params.id;
            if(!productID) throw new Error("Bad ID")
            const getProductByIdUseCase = container.resolve("GetProductByIdUseCase")
            const products = await getProductByIdUseCase.execute(productID);
            return res.status(201).json(products)
        }
        catch (err) {
            return res.status(500).json({ message: "Error" });
        }
    }

    
}