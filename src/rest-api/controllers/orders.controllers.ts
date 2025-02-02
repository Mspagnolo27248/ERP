import { NextFunction, Request, Response } from "express";
import { PricingRepositoryImp } from "../../core-layer/pricing-module/data-access-repository/PricingReposityoryImp";
import { PriceRetrievalService } from "../../core-layer/pricing-module/domain-services/PriceRetrievalService";
import { ConnectionManager } from "../../shared-common/database/custom-orm/orm/ConnectionManager";
import path from "path";
import { OrderRepositoryImp } from "../../core-layer/order-entry/data-access-repository/OrderEntryRepositoryImp";
import { CreateOrderHeaderUseCase } from "../../core-layer/order-entry/use-cases/CreateOrderHeaderUseCase";
import { CreateOrderDetailUseCase } from "../../core-layer/order-entry/use-cases/CreateOrderDetailUseCase";
import { OrderDetailDTO, OrderHeaderDTO } from "../../core-layer/order-entry/data-access-repository/order-entry-dtos";

// export  class OrderController { 


//     @withHttpErrorHandling()
//     static async getOrder(req: Request, res: Response) {
//         const orderRepository = new OrderRepositoryImp();
//         const order = await orderRepository.getOrderHeader(req.params.orderId);
//       return res.status(201).json(order);
//     }
// }   

async function test1(){  
   
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

async function test2(){
    const orderRepository = new OrderRepositoryImp();
    const pricingRepository = new PricingRepositoryImp();
    const createOrderHeaderUseCase = new CreateOrderDetailUseCase(orderRepository,pricingRepository);
    

    const orderDetail = {
        productID: "4315",
        containerID: "001",
        uom: "GAL",
        unitPrice: 3.84,
        quantity: 100
    } as OrderDetailDTO;

    const orderHeader = {
        orderDate: "20250201",
        customerID: "4450"
    } as OrderHeaderDTO;

    const result = await createOrderHeaderUseCase.excute(orderDetail,orderHeader);
    console.log(result);
}

ConnectionManager.getInstance().configureConnection('sqlite', {database: path.join('./', 'database.sqlite')});
test2();

