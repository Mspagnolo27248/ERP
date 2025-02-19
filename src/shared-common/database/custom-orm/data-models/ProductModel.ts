import { ProductDto } from "../../../../core-layer/pricing-module/data-transfer-objects/price-records-dtos";
import { ARGModel, KeyField, TableColumn } from "../orm-decorators";
import { BaseModel } from "../orm/BaseModel";


@ARGModel('ZGSPROD')
export class ProductModel extends BaseModel implements ProductDto {
    @KeyField
    @TableColumn('TPPROD')
    productId: string = '';

    @TableColumn('TPDESC')
    productName: string = '';

    @TableColumn('TPCONO')
    companyNumber: number = 0;

    @TableColumn('TPIND8')
    inactiveDate: number = 0;

    @TableColumn('TPPLGR')
    TPPLGR: number = 0;

    @TableColumn('TPPLCL')
    priceClass: number = 0;

    @TableColumn('TPPRGP')
    productGroup: string = '';

    @TableColumn('TPTOCO')
    toCompany: number = 0;

    @TableColumn('TPSHDS')
    shortDescription: string = '';

    @TableColumn('TPPRCL')
    productClass: string = '';

    @TableColumn('TPGRAV')
    apiGravity: number = 0;

    @TableColumn('TPINGP')
    inventoryGroup: string = '';

    @TableColumn('TPSGLN')
    salesGL: number = 0;

    @TableColumn('TPABDS')
    abbreviatedDescription: string = '';

    @TableColumn('TPSELL')
    sellIndicator: string = '';

    @TableColumn('TPVCFC')
    viscosityFlowCode: string = '';

    @TableColumn('TPFLCD')
    isFluid: string = '';

    @TableColumn('TPRPSL')
    reportingSlate: string = '';
}