import { OrderHeaderDTO } from "../../../../core-layer/order-entry/data-access-repository/order-entry-dtos";
import { ARGModel, KeyField, TableColumn } from "../orm-decorators";
import { BaseModel } from "../orm/BaseModel";

@ARGModel('OrderHeader')
export class OrderHeaderModel extends BaseModel implements OrderHeaderDTO{
    @KeyField
    @TableColumn('OrderID')
    orderID: string = '';  // Primary key
    
    @TableColumn('CustomerID')
    customerID: string = '';
    
    @TableColumn('OrderDate')
    orderDate: string = '';  // Can default to current date in actual usage
    
    @TableColumn('BilledQtyUom')
    billedQtyUom: number = 0;

    @TableColumn('BilledRevenue')
    billedRevenue: number =0;

    @TableColumn('BilledGallons')
    billedGallons: number = 0;

}
