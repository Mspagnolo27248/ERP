import {ProductDto, RackPriceDto } from "../data-transfer-objects/price-records-dtos";





export interface PricingRepository { 
    getAllRackPricing(): Promise<RackPriceDto[]> ; 
    getRackPriceByKey(key:{[key:string]:[keyof RackPriceDto]}): Promise<RackPriceDto>; 
    upsertRackPrice(rackPriceDto: RackPriceDto): Promise<RackPriceDto>
    deleteRackPrice(instance:RackPriceDto): Promise<RackPriceDto>  
    getProductById(productId: string): Promise<ProductDto>; /*these would be in a master data repo*/ 
    getAllProducts(): Promise<ProductDto[]> /*these would be in a master data repo*/ 
}

