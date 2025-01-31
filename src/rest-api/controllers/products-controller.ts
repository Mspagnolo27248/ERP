import { NextFunction, Request, Response } from "express";
import { container } from "../../shared-common/dependency-injection/register-dependencies";
import { withHttpErrorHandling } from "../utility/error-handler";
import { ProductModel } from "../../shared-common/database/custom-orm/data-models/ProductModel";

export class ProductsController {
  @withHttpErrorHandling()
  static async getAll(req: Request, res: Response) {
    const getProductsUseCase = container.resolve("GetProductUseCase");
    const products = await getProductsUseCase.execute();
    return res.status(201).json(products);
  }

  @withHttpErrorHandling()
  static async getOne(req: Request, res: Response) {
    const productID = req.params.id;
    if (!productID) throw new Error("Bad ID");
    const getProductByIdUseCase = container.resolve("GetProductByIdUseCase");
    const products = await getProductByIdUseCase.execute(productID);
    return res.status(201).json(products);
  }

  @withHttpErrorHandling()
  static async delete(req: Request, res: Response) {
    const productID = req.params.id;
    if (!productID) throw new Error("Bad ID");
    const data = await ProductModel.delete({ productId: productID });
    return res.status(201).json(data);
  }

  @withHttpErrorHandling()
  static async upsert(req: Request, res: Response) {
    const product = req.body;
    if (!product.productId) throw new Error("Bad ID");
    const data = await ProductModel.upsert(product);
    return res.status(201).json(data);
  }

//   @withHttpErrorHandling()
//   static async insert(req: Request, res: Response) {
//     const product = req.body;
//     if (!product.productId) throw new Error("Bad ID");
//     const data = await ProductModel.insert(product);
//     return res.status(201).json(data);
//   }

}
