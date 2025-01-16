


export interface RackPriceDto {
    companyNumber: number;        // RKCONO
    location: string;             // RKLOC
    productCode: string;          // RKPROD
    containerCode: string;        // RKCNTR
    unitOfMeasure: string;        // RKUNMS
    effectiveDate: string;        // RKDATE (formatted as string for readability)
    effectiveTime: number;        // RKTIME
    price: number;                // RKPRCE
    priceTier1: string;           // RKPR02
    priceTier2: string;           // RKPR03
    priceTier3: string;           // RKPR04
    priceTier4: string;           // RKPR05
    minimumQuantity: number;      // RKMINQ
    quantityTier1: number;        // RKQT01
    quantityTier2: number;        // RKQT02
    quantityTier3: number;        // RKQT03
    quantityTier4: number;        // RKQT04
    quantityTier5: number;        // RKQT05
    requiredFlag: string;      // RKRKRQ
    inactiveFlag: string;         // RKINAC 
}

export interface RackPriceKeys
{
location:string
productCode:string;
containerCode:string;
unitOfMeasure:string;
effectiveDate:string;
effectiveTime:number;
}

export interface PriceAgreementDto {
productCode: string;
containerCode: string;
customerCode: string;
customerShipTo?: string;
startDate: number;
endDate: number;
}


export interface ProductDto {
    productId: string ;
    productName: string;
    companyNumber: string;
    inactiveDate: number;
    TPPLGR: number;
    productClass: number ;
    productGroup: string ;
    toCompany: number ;
    shortDescription: string ;
    priceClass: string ;
    apiGravity: number ;
    inventoryGroup: string ;
    salesGL: number ;
    abbreviatedDescription: string ;
    sellIndicator: string ;
    viscosityFlowCode: string ;
    isFluid: string ;
    lbsPerGallon?:number;

}
  

