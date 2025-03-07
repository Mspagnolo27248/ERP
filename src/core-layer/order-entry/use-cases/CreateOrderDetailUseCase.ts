import { PricingRepository } from "../../pricing-module/data-access-repository/PricingRepository";
import { PriceRetrievalUseCase } from "../../pricing-module/use-cases/PriceRetrievalUseCase";

import { OrderDetailDTO, OrderHeaderDTO } from "../data-access-repository/order-entry-dtos";
import { OrderRepository } from "../data-access-repository/OrderEntryRepository";




export class CreateOrderDetailUseCase {

constructor(private orderRepository: OrderRepository, private pricingRepository: PricingRepository){
}

    async excute(orderDetail: OrderDetailDTO, orderHeader: OrderHeaderDTO): Promise<OrderDetailDTO> {

        await this.validatePrice(orderDetail, orderHeader);
        return {...orderDetail,...orderHeader};
     
    }
    
    
    async validatePrice(orderDetail: OrderDetailDTO, orderHeader: OrderHeaderDTO) {
        const priceRetrievalUseCase = new PriceRetrievalUseCase(this.pricingRepository);

        const price = await priceRetrievalUseCase.execute({
           productId: orderDetail.productID,
            containerId: orderDetail.containerID,
             unitOfMeasure: orderDetail.uom,
              shipDate: parseInt(orderHeader.orderDate),
               customerId: orderHeader.customerID,
                location: '001'});
        
        if(orderDetail.unitPrice !== price.price){
            throw new Error("Price mismatch");
        }

    }


}
