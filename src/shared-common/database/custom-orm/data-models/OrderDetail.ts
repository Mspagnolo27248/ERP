
import { OrderDetailDTO } from "../../../../core-layer/order-entry/data-access-repository/order-entry-dtos";
import { UnitOfMeasure } from "../../../../core-layer/pricing-module/domain-enums/price-record-enums";
import { ARGModel, IdentityColumn, KeyField, TableColumn } from "../orm-decorators";
import { BaseModel } from "../orm/BaseModel";




@ARGModel('OrderDetail')
export class OrderDetailModel extends BaseModel  implements OrderDetailDTO{
    @KeyField 
    @IdentityColumn()
    @TableColumn('OrderDetailID')
    orderDetailID: string = '';  // Primary key

    @KeyField
    @TableColumn('OrderID')
    orderID: string = '';  // Foreign key to OrderHeader

    @TableColumn('ProductID')
    productID: string = '0';

    @TableColumn('Quantity')
    quantity: number = 0;

    @TableColumn('UnitPrice')
    unitPrice: number = 0;   

    @TableColumn('ContainerID')
    containerID: string = '';
    
    @TableColumn('UOM')
    uom: UnitOfMeasure = UnitOfMeasure.GAL;
}


