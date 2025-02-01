import { ARGModel, KeyField, TableColumn } from "../orm-decorators";
import { BaseModel } from "../orm/BaseModel";

@ARGModel('GGSPROD_BKP')
export class BlendRequirementModel extends BaseModel {
    @KeyField
    @TableColumn('Finished_ProductCode')
    finishedProductCode: string = '';

    @KeyField
    @TableColumn('Component_ProductCode')
    componentProductCode: string = '';

    @TableColumn('Finished_ProductDesc')
    finishedProductDesc: string | null = null;

    @TableColumn('Component_ProductDesc')
    componentProductDesc: string | null = null;

    @TableColumn('BlendPercent')
    blendPercent: number = 0;
}
