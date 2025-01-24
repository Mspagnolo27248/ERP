import { ApplicationError } from "../../general/Errors/errors";
import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { Product } from "../domain-entities/Product";




export class GetProductUseCase implements UseCase {
    pricingRepository:PricingRepository;

    constructor(repository:PricingRepository){
        this.pricingRepository = repository
    }

    async execute(): Promise<Product[]> { 
        try{           
            const results =  await this.pricingRepository.getAllProducts()
            const productEntites = results.map(item=> new Product(item));    
            return productEntites;
        } catch (error) {
            throw new ApplicationError(error,"Error fetching products");
        }
        
    }
}