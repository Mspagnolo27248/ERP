
import { CustomerShipToDTO } from "../../../../core-layer/order-entry/data-access-repository/order-entry-dtos";
import { ARGModel, TableColumn } from "../orm-decorators";
import { BaseModel } from "../orm/BaseModel";



@ARGModel('CustomerShipTo')
export class CustomerShipToModel extends BaseModel implements CustomerShipToDTO {
    @TableColumn('CustomerShipToId')
    customerShipToId: string = '';  // Composite key (ShipToID, CustomerID)
    
    @TableColumn('ShipToID')
    shipToID: string = '';
    
    @TableColumn('')
    shipToName: string = '';
    
    @TableColumn('')
    customerID: string = '';
    
    @TableColumn('')
    customerName: string = '';
    
    @TableColumn('')
    salespersonID: string = '';
    
    @TableColumn('')
    salespersonName: string = '';
    
    @TableColumn('')
    city: string = '';
    
    @TableColumn('')
    state: string = '';
    
    @TableColumn('')
    country: string = '';
    
    @TableColumn('')
    company: string = '';

}