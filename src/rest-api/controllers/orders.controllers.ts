import { NextFunction, Request, Response } from "express";
import { PricingRepositoryImp } from "../../core-layer/pricing-module/data-access-repository/PricingReposityoryImp";
import { PriceRetrievalService } from "../../core-layer/pricing-module/domain-services/PriceRetrievalService";
import { ConnectionManager } from "../../shared-common/database/custom-orm/orm/ConnectionManager";
import path from "path";

// export  class OrderController { 


//     @withHttpErrorHandling()
//     static async getOrder(req: Request, res: Response) {
//         const orderRepository = new OrderRepositoryImp();
//         const order = await orderRepository.getOrderHeader(req.params.orderId);
//       return res.status(201).json(order);
//     }
// }   

async function test(){  
    ConnectionManager.getInstance().configureConnection('sqlite', {database: path.join('./', 'database.sqlite')});
    const pricingRepository = new PricingRepositoryImp();
    const priceRetrievalService = new PriceRetrievalService(pricingRepository);
    const price = await priceRetrievalService.execute({
        productId: "4315",
        containerId: "001",
        unitOfMeasure: "GAL",
        shipDate: 20250201,
        customerId: '4450',
        location: '001'
    });
    console.log(price);
}

test();
