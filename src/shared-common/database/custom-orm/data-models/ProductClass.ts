import { ARGModel, KeyField, TableColumn } from "../orm-decorators";
import { BaseModel } from "../orm/BaseModel";



@ARGModel('ZGSPRCL')
export class ProductClass extends BaseModel {

    @KeyField
    @TableColumn('PCCO')
    company: number = 0;
    
    @KeyField
    @TableColumn('PCPRCL')
    productClass: string = '';
    
    @TableColumn('PCDESC')
    classDescription: string = ''
    
    @TableColumn('PCDIV')
    division: string = '';

}