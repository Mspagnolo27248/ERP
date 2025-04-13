import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { ProductDto } from "../data-transfer-objects/price-records-dtos";



export class UpdateProductUseCase extends UseCase {
    constructor(private readonly pricingRepository: PricingRepository) {
        super();
    }

    async execute(product: ProductDto): Promise<ProductDto> {

        //Validate Product is length 4
        if(!(product.productId.length==4))  this.throwApplicationError(new Error('Product Needs to be 4 Chars'))
        
        //Existence Check Product Class
        const classTable = await this.pricingRepository.getAllProductClasses();
        const classList = classTable.map(record=>record.productClass)
        if(!(classList.includes(product.productClass)))  this.throwApplicationError(new Error('Class Does not exists'))
        
        //Validation and Business Rules Satisfied Complete Insert or Udpate
        const updatedProduct =  this.pricingRepository.updateProduct(product);
        return updatedProduct
    }
    
}
