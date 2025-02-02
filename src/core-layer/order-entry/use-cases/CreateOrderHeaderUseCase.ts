import { OrderHeaderDTO } from "../data-access-repository/order-entry-dtos";
import { OrderRepository } from "../data-access-repository/OrderEntryRepository";



export class CreateOrderHeaderUseCase {

    constructor(private orderRepository: OrderRepository){

    }

    async excute(orderHeader: OrderHeaderDTO): Promise<OrderHeaderDTO> {
        return {} as OrderHeaderDTO;
    }
}
