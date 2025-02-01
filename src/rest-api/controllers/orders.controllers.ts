import { NextFunction, Request, Response } from "express";
import { OrderRepositoryImp } from "../../core-layer/order-entry/data-access-repository/OrderEntryRepositoryImp";
import { withHttpErrorHandling } from "../utility/error-handler";

// export  class OrderController { 


//     @withHttpErrorHandling()
//     static async getOrder(req: Request, res: Response) {
//         const orderRepository = new OrderRepositoryImp();
//         const order = await orderRepository.getOrderHeader(req.params.orderId);
//       return res.status(201).json(order);
//     }
// }   

async function test(){  
    const repository = new OrderRepositoryImp();
    const order = await repository.getOrderHeader("997");
    const orderDetails = await repository.getOrderDetails("997");
    const orderFull = {order, orderDetails};
    console.log(orderFull);
}

test();
