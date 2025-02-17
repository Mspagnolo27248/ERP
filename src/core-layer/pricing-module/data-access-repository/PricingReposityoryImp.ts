import { PriceAgreementModel } from "../../../shared-common/database/custom-orm/data-models/PriceAgreementModel";
import { ProductModel } from "../../../shared-common/database/custom-orm/data-models/ProductModel";
import { RackPriceModel } from "../../../shared-common/database/custom-orm/data-models/RackPriceModel";
import { MasterDataCache } from "../../general/MasterDataCache";
import { Repository } from "../../general/Repository";
import {  PriceAgreementDto,  PriceAgreementKeys,  ProductDto,  RackPriceDto,} from "../data-transfer-objects/price-records-dtos";
import { PricingRepository } from "./PricingRepository";

// Repository Implementation Responsibilities:
// 1. **Abstract Database Interactions**: The repository implementation is responsible for interacting directly with the database or ORM layer.
//    - It bridges the gap between the application use-cases and the persistence mechanism.
// 2. **Perform CRUD Operations**: Implement Create, Read, Update, and Delete methods that map to specific domain entities (e.g., RackPriceModel, ProductModel).
// 3. **Handle Data Mapping**: Convert database entities or raw data into domain-specific DTOs (Data Transfer Objects) for use by the application layer.
// 4. **Error Handling**: Catch database-related errors and rethrow them with meaningful error messages for better debugging.
// 5. **No Business Logic**: The repository must not contain any business rules or validations; it strictly handles data persistence and retrieval.
// 6. **Consistency**: Ensure that database queries and results adhere to the contract defined in the repository interface (e.g., `PricingRepository`).

// Example Best Practices in Repository Implementation:
// - Use transactions where necessary for atomic operations.
// - Ensure all data returned from the database matches the DTO structure expected by the use-cases.
// - Entities should not be passed to the Repository stick to DTO's you should not be instantiating Domain entities in this layer
// - Avoid hardcoding SQL queries directly unless required, leveraging ORM features where possible.

export class PricingRepositoryImp
  extends Repository
  implements PricingRepository
{
  private cache: MasterDataCache;

  constructor(cache: MasterDataCache) {
    super();
    this.cache = cache;

  }

  async getAllRackPricing(where?: Partial<RackPriceDto>): Promise<RackPriceDto[]> {
    try {
      const records = await RackPriceModel.findAll(where);
      return records;
    } catch (error) {
      this.thowInfrastuctureError(error);
    }
  }


  async getRackPriceByKey(keys: Partial<RackPriceDto>): Promise<RackPriceDto> {
    try {
      return await RackPriceModel.findByKey(keys);
    } catch (error) {
      this.thowInfrastuctureError(error);
    }
  }



  async getAllProducts(): Promise<ProductDto[]> {
    try {
     const products = await this.cache.getTable<ProductDto>('products',
        async () => {
          const products = await ProductModel.findAll();
          return products.reduce((acc, product) => {
            acc[product.productId] = product as ProductDto;
            return acc;
          }, {} as Record<string, ProductDto>);
        }
      );
      return Object.values(products);
    } catch (error) {
      this.thowInfrastuctureError(error);
    }
  }


  
  async getProductById(productId: string): Promise<ProductDto> {
    try {
          const product = await this.cache.getByKey(
            'products',
            productId,
            async () => {
              const product = await ProductModel.findByKey({ productId });
              return product as ProductDto;
            }
            );
            return product as ProductDto;

    } catch (error) {
      this.thowInfrastuctureError(error);
    }
  }

  async createProduct(product: ProductDto): Promise<ProductDto> {
    try {
      const results = await ProductModel.upsert(product);
      if(!results) {
        throw new Error('Product not created');
      }
      this.cache.invalidateTable('products');
      return results
    } catch (error) {
      this.thowInfrastuctureError(error);
    }
  }


  async getPriceAgreementByKey(
    keys: PriceAgreementKeys
  ): Promise<PriceAgreementDto> {
    try {
      return await PriceAgreementModel.findByKey(keys);
    } catch (error) {
      this.thowInfrastuctureError(error);
    }
  }


  async getAllPriceAgreements(
    where?: Partial<PriceAgreementDto>
  ): Promise<PriceAgreementDto[]> {
    return await PriceAgreementModel.findAll(where);
  }

  async deleteProduct(productId: string){
    try {
      const results = await ProductModel.delete({ productId });
      if(!results) {
        throw new Error('Product not deleted');
      }
      this.cache.invalidateTable('products');
      return results;
    } catch (error) {
      this.thowInfrastuctureError(error);
    }
  }

}
