import { OrderHeaderDTO } from "../../../../core-layer/pricing-module/data-transfer-objects/order-entry-dtos";
import { ARGModel, KeyField, TableColumn } from "../orm-decorators";
import { BaseModel } from "../orm/BaseModel";

@ARGModel('OrderHeader')
export class OrderHeaderModel extends BaseModel implements OrderHeaderDTO{
    @KeyField
    @TableColumn('OrderID')
    orderID: number = 0;  // Primary key
    
    @TableColumn('CustomerID')
    customerID: number = 0;
    
    @TableColumn('OrderDate')
    orderDate: string = '';  // Can default to current date in actual usage
    
    @TableColumn('BilledQtyUom')
    billedQtyUom: number = 0;

    @TableColumn('BilledRevenue')
    billedRevenue: number =0;

    @TableColumn('BilledGallons')
    billedGallons: number = 0;

}
