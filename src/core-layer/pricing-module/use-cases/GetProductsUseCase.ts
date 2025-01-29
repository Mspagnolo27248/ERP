import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { Product } from "../domain-entities/Product";




export class GetProductUseCase extends UseCase {
    pricingRepository:PricingRepository;

    constructor(repository:PricingRepository){
        super();
        this.pricingRepository = repository
    }

    async execute(): Promise<Product[]> { 
        try{           
            const results =  await this.pricingRepository.getAllProducts()
            const productEntites = results.map(item=> new Product(item));    
            return productEntites;
        } catch (error) {
            if(error instanceof Error) throw error
            this.throwApplicationError("GetProductUseCase failed");
        }
        
    }
}