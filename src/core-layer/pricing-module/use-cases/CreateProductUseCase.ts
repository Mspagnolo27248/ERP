import { ProductDto } from "../data-transfer-objects/price-records-dtos";
import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";

export class CreateProductUseCase extends UseCase {
  constructor(private readonly pricingRepository: PricingRepository) {
    super();
  }

  async execute(product: ProductDto): Promise<ProductDto> {
    try {
      this.validateProductId(product.productId);
      await this.validateProductClass(product.productClass);

      return await this.pricingRepository.createProduct(product);
    } catch (error) {
      this.throwApplicationError(error);
    
    }
  }

  private validateProductId(productId: string): void {
    if (productId.length !== 4) {
      throw new Error("Product ID must be 4 characters long.");
    }
  }

  private async validateProductClass(productClass: string): Promise<void> {
    const classTable = await this.pricingRepository.getAllProductClasses();
    const classList = classTable.map(record => record.productClass);

    if (!classList.includes(productClass)) {
      throw new Error("Product class does not exist.");
    }
  }
}
