import { NextFunction, Request, Response } from "express";
import { PricingRepository } from "../../core-layer/pricing-module/data-access-repository/PricingRepository";
import { PricingRepositoryImp } from "../../core-layer/pricing-module/data-access-repository/PricingReposityoryImp";

const pricingRepository: PricingRepository = new PricingRepositoryImp();


export class ProductsController {


    static async getAll(req: Request, res: Response){

        return res.status(201).json({})

    }

    static async getOne(req: Request, res: Response){
        return res.status(201).json({})
    }

}