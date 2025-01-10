import { PriceAgreementDto, ProductDto, RackPriceDto } from "../data-transfer-objects/price-records-dtos";





export interface PricingRepository {
    createPriceAgreement(params:PriceAgreementDto):Promise<PriceAgreementDto>;
    createRackPrice(rackPrice: RackPriceDto): Promise<RackPriceDto>;
    getProductById(productId: string): Promise<ProductDto>;
    getAllRackPricing(): Promise<RackPriceDto[]> ;
    getAllPriceAgreements():Promise<PriceAgreementDto[]>;
    getAllProducts(): Promise<ProductDto[]>
    getOneUOMAndGallonFactor(productId: string, containerId: string, uom: string): Promise<{unitsOfMeasureInAContainer: number,gallonsInAContainer: number}>;    
    getManyUOMAndGallonFactor(): Promise<ConversionFactorType>   
}

export type ConversionFactorType = Record<string, { unitsOfMeasureInAContainer: number, gallonsInAContainer: number }>

export type UOMAndGallonFactorCompositeKeyType = {
  productId: string, containerId: string, uom: string
}