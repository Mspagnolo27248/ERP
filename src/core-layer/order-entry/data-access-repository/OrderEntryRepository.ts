import { OrderDetailDTO, OrderDetailKeys, OrderHeaderDTO } from "./order-entry-dtos";

export interface OrderRepository {  
    getOrderHeader(orderId: string):Promise<OrderHeaderDTO>
    getOrderDetail(keys: OrderDetailKeys): Promise<OrderDetailDTO>  
    getOrderDetails(orderId: string): Promise<OrderDetailDTO[]>  
}