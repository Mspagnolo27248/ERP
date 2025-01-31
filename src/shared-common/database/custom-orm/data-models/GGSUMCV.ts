import { ARGModel, TableColumn } from "../orm-decorators";
import { BaseModel } from "../orm/BaseModel";

@ARGModel('GGSUMCV')
export class UnitConversionModel extends BaseModel {
    @TableColumn('UCDEL')
    actionIndicator: string = '';

    @TableColumn('UCCONO')
    companyNumber: number = 10;

    @TableColumn('UCPROD')
    productCode: string = '';

    @TableColumn('UCFUNM')
    fromUnitOfMeasure: string = '';

    @TableColumn('UCTUNM')
    toUnitOfMeasure: string = '';

    @TableColumn('UCOPER')
    operationCode: string = '';

    @TableColumn('UCCVFA')
    conversionFactor: number = 0;

    @TableColumn('UCF001')
    additionalFeature: string = '';
}
