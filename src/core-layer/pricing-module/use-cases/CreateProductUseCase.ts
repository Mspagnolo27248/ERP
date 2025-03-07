import { ProductDto } from "../data-transfer-objects/price-records-dtos";
import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { Product } from "../domain-entities/Product";



export class CreateProductUseCase extends UseCase {
  constructor(private readonly pricingRepository: PricingRepository) {
    super();
  }

  async execute(productDto: ProductDto): Promise<ProductDto> {
    const product = new Product(productDto);
    return this.pricingRepository.createProduct(product.toDTO());
  }
}
