import { Entity } from "../../general/Entity";
import { RackPriceDto } from "../data-transfer-objects/price-records-dtos";



export class RackPrice extends Entity {
    companyNumber: number;
    location: string;
    productCode: string;
    containerCode: string;
    unitOfMeasure: string;
    effectiveDate: number;
    effectiveTime: number;
    price: number;
    priceTier1: string;
    priceTier2: string;
    priceTier3: string;
    priceTier4: string;
    minimumQuantity: number;
    quantityTier1: number;
    quantityTier2: number;
    quantityTier3: number;
    quantityTier4: number;
    quantityTier5: number;
    noRackFlag: string;
    inactiveFlag: string;
    statusFlag:string;
  

    constructor(rackPriceDto: RackPriceDto) {
        super();
        this.companyNumber = rackPriceDto.companyNumber;
        this.location = rackPriceDto.location;
        this.productCode = rackPriceDto.productCode;
        this.containerCode = rackPriceDto.containerCode;
        this.unitOfMeasure = rackPriceDto.unitOfMeasure.trim();
        this.effectiveDate = rackPriceDto.effectiveDate;
        this.effectiveTime = rackPriceDto.effectiveTime;
        this.price = rackPriceDto.price;
        this.priceTier1 = rackPriceDto.priceTier1;
        this.priceTier2 = rackPriceDto.priceTier2;
        this.priceTier3 = rackPriceDto.priceTier3;
        this.priceTier4 = rackPriceDto.priceTier4;
        this.minimumQuantity = rackPriceDto.minimumQuantity==0?1:rackPriceDto.minimumQuantity;
        this.quantityTier1 = rackPriceDto.quantityTier1;
        this.quantityTier2 = rackPriceDto.quantityTier2;
        this.quantityTier3 = rackPriceDto.quantityTier3;
        this.quantityTier4 = rackPriceDto.quantityTier4;
        this.quantityTier5 = rackPriceDto.quantityTier5;
        this.noRackFlag = rackPriceDto.noRackFlag;
        this.inactiveFlag = rackPriceDto.inactiveFlag;

        
        //Validations      
        this.validateMinQuantity(this.minimumQuantity)
        this.validationNoRack(this.noRackFlag);
        this.validationInactiveField(this.inactiveFlag);
        this.validatePrice(this.price);

        this.statusFlag = this.setStatusFlag(this.effectiveDate);

    }

    private validatePrice(price: number) {
        if(price <=0) this.throwDomainError("Price must be greater than 0")
    }
    private validateMinQuantity(qty: number) {
        if (qty < 1) this.throwDomainError("Min Quantity Must be greater than 1")
    }

    private validationNoRack(noRackFlag: string) {
        if (!(noRackFlag === 'N' || noRackFlag === '')) {
            this.throwDomainError("Invalid No Rack Flag must be N or '")
        }
    }

    private validationInactiveField(inActiveflag: string) {
        if (!(inActiveflag === 'I' || inActiveflag === '')) {
            this.throwDomainError("Invalid In-active field value 'I'  or blank")
        }
    }

    private setStatusFlag(effectiveDate:number){
        let statusFlag = '';
        const dateString = effectiveDate.toString(); 
        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(4, 6), 10) - 1; 
        const day = parseInt(dateString.substring(6, 8), 10);
    
        const dateToCompare = new Date(year, month, day); 
        const today = new Date();
        dateToCompare> today?statusFlag = 'FUT': statusFlag = 'CUR'
        return statusFlag;
    }


}
