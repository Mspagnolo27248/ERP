
import { initializeDb } from "../../../shared-common/database/sqlite";
import { OrderDetailDTO, OrderDetailKeys, OrderDTO, OrderHeaderDTO } from "./order-entry-dtos";
import { OrderRepository } from "./OrderEntryRepository";

export class OrderRepositoryImp implements OrderRepository { 
    async getOrderDetail(keys: OrderDetailKeys): Promise<OrderDetailDTO> {
        const orderDetail = await sqliteGetOrderDetail(keys);
        return orderDetail;
          
    }

    async getOrderHeader(orderId: string): Promise<OrderHeaderDTO> {
        const orderHeader = await sqliteGetOrderHeader(orderId);
        return orderHeader;
    }

    async getOrderDetails(orderId: string): Promise<OrderDetailDTO[]> {
        const orderDetails = await sqliteGetOrderDetails(orderId);
        return orderDetails;
    }
}



async function sqliteGetOrderDetail(keys: OrderDetailKeys): Promise<OrderDetailDTO> {
    const db = await initializeDb();
    const sql = `SELECT * FROM OrderDetail WHERE OrderDetailID = ? AND OrderID  ?`;
    const orderDetail = await db.get(sql, [keys.orderDetailID, keys.orderID]);
    return orderDetail;
}

async function sqliteGetOrderHeader(orderId: string): Promise<OrderHeaderDTO> {
    const db = await initializeDb();
    const sql = `SELECT * FROM OrderHeader WHERE OrderID = ?`;
    const orderHeader = await db.get(sql, [orderId]);
    return orderHeader;
}

async function sqliteGetOrderDetails(orderId: string): Promise<OrderDetailDTO[]> {
    const db = await initializeDb();
    const sql = `SELECT * FROM OrderDetail WHERE OrderID = ?`;
    const orderDetails = await db.all(sql, [orderId]);
    return orderDetails;
}
    



