import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { ProductDto } from "../data-transfer-objects/price-records-dtos";



export class UpdateProductUseCase extends UseCase {
    constructor(private readonly pricingRepository: PricingRepository) {
        super();
    }

    async execute(product: ProductDto): Promise<ProductDto> {
        return this.pricingRepository.updateProduct(product);
    }
    
}
