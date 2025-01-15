import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { ProductDto } from "../data-transfer-objects/price-records-dtos";
import { Product } from "../domain-entities/Product";




export class GetProductByIdUseCase implements UseCase {
    pricingRepository:PricingRepository;
    constructor(repository:PricingRepository){
        this.pricingRepository = repository
    }

    async execute(productId:string): Promise<ProductDto> {            
        const dto =  await this.pricingRepository.getProductById(String(productId))
        const productEntity = new Product(dto);    
        return productEntity;
        
    }
}