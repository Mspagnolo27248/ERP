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
    createProduct(product: ProductDto): Promise<ProductDto>
    // upsertRackPrice(rackPriceDto: RackPriceDto): Promise<RackPriceDto>
    deleteProduct(productId: string): Promise<any>;
    getPriceAgreementByKey(price:PriceAgreementKeys): Promise<PriceAgreementDto>;
    getAllPriceAgreements(where?:Partial<PriceAgreementDto>): Promise<PriceAgreementDto[]>;
}

