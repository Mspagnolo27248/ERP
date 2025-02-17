import { ProductDto } from "../data-transfer-objects/price-records-dtos";
import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";



export class CreateProductUseCase extends UseCase {
  constructor(private readonly pricingRepository: PricingRepository) {
    super();
  }

  async execute(product: ProductDto): Promise<ProductDto> {
    return this.pricingRepository.createProduct(product);
  }
}
