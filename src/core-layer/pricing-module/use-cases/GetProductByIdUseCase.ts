import { ApplicationError } from "../../general/Errors/errors";
import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { Product } from "../domain-entities/Product";




export class GetProductByIdUseCase implements UseCase {
    pricingRepository:PricingRepository;
    
    constructor(repository:PricingRepository){
        this.pricingRepository = repository
    }

    async execute(productId:string): Promise<Product> {    
        try {
            const dto =  await this.pricingRepository.getProductById(String(productId))
            const entity = new Product(dto);    
            return entity.toDTO();
        } catch (error) {
            throw new ApplicationError(error,"Error fetching product by id");
        }
        
    }
}