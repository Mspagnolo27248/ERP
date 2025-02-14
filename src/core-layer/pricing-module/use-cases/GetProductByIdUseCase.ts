import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { Product } from "../domain-entities/Product";




export class GetProductByIdUseCase extends UseCase {    
    pricingRepository:PricingRepository;
    
    constructor(repository:PricingRepository){
        super();
        this.pricingRepository = repository
    }

    async execute(productId:string): Promise<Product> {  
        try {
            const dto =  await this.pricingRepository.getProductById(String(productId))
            if(!dto) throw new Error("No Product Exists")          
            const entity = new Product(dto);    
            return entity.toDTO();

        } catch (error) {
            if(error instanceof Error) throw error
            this.throwApplicationError("GetProductByIdUseCase failed");
        }        
    }
}