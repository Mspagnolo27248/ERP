import {PriceAgreementDto, PriceAgreementKeys, ProductDto, RackPriceDto, RackPriceKeys } from "../data-transfer-objects/price-records-dtos";


/*
// Repository:  Data Access Interface 
// 1. Always return a promise. 
// 2. I/O DTO's or VOID only  not entities
// 3. 

*/



export interface PricingRepository { 
    getAllRackPricing(where?:Partial<RackPriceDto>): Promise<RackPriceDto[]> ; 
    getRackPriceByKey(keys:RackPriceKeys): Promise<RackPriceDto>;  
    getProductById(productId: string): Promise<ProductDto>; /*these would be in a master data repo here for simplicty*/ 
    getAllProducts(): Promise<ProductDto[]> 
    // upsertRackPrice(rackPriceDto: RackPriceDto): Promise<RackPriceDto>
    // deleteRackPrice(instance:RackPriceDto): Promise<RackPriceDto>    
    getPriceAgreementByKey(price:PriceAgreementKeys): Promise<PriceAgreementDto>;
    getAllPriceAgreements(where?:Partial<PriceAgreementDto>): Promise<PriceAgreementDto[]>;
}

