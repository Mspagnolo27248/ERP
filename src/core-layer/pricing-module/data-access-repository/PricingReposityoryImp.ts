import { PriceAgreementModel } from "../../../shared-common/database/custom-orm/data-models/PriceAgreementModel";
import { ProductModel } from "../../../shared-common/database/custom-orm/data-models/ProductModel";
import { RackPriceModel } from "../../../shared-common/database/custom-orm/data-models/RackPriceModel";
import { MasterDataCache } from "../../general/MasterDataCache";
import { Repository } from "../../general/Repository";
import { PriceAgreementDto, PriceAgreementKeys, ProductDto, RackPriceDto, RackPriceKeys } from "../data-transfer-objects/price-records-dtos";
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



export class PricingRepositoryImp extends Repository implements PricingRepository {
  private cache: MasterDataCache;
  private static readonly TABLES = {
    PRODUCTS: 'products',
    RACK_PRICES: 'rackPrices',
    PRICE_AGREEMENTS: 'priceAgreements'
  };

  constructor(cache: MasterDataCache) {
    super();
    this.cache = cache;
  }

  async getAllRackPricing(where?: Partial<RackPriceDto>): Promise<RackPriceDto[]> {
    try {
      if (!where) {
        // If no filters, use cached table data
        const cachedData = await this.cache.getTable<RackPriceDto>(
          PricingRepositoryImp.TABLES.RACK_PRICES,
          async () => {
            const records = await RackPriceModel.findAll();
            // Convert array to Record with ID as key
            return records.reduce((acc, record) => {
              const key = this.createRackPriceKey(record as RackPriceDto);
              acc[key] = record as RackPriceDto;
              return acc;
            }, {} as Record<string, RackPriceDto>);
          }
        );
        return Object.values(cachedData);
      }
      
      // If there are filters, bypass cache
      return await RackPriceModel.findAll(where);
    } catch (error) {
      this.thowInfrastuctureError(error);
    }
  }

  private createRackPriceKey(rackPrice: RackPriceDto | RackPriceKeys): string {
    // Create a unique key based on the rack price's identifying fields
    return `${rackPrice.productCode}-${rackPrice.containerCode}-${rackPrice.unitOfMeasure}`;
  }

  async getRackPriceByKey(keys: Partial<RackPriceDto>): Promise<RackPriceDto> {
    try {
      const cacheKey = this.createRackPriceKey(keys as RackPriceKeys);
      return await this.cache.getRecord<RackPriceDto>(
        PricingRepositoryImp.TABLES.RACK_PRICES,
        cacheKey,
        async () => await RackPriceModel.findByKey(keys)
      );
    } catch (error) {
      this.thowInfrastuctureError(error);
    }
  }

  async getProductById(productId: string): Promise<ProductDto> {
    try {
      return await this.cache.getRecord<ProductDto>(
        PricingRepositoryImp.TABLES.PRODUCTS,
        productId,
        async () => {
          const product = await ProductModel.findByKey({ productId });
          if (!product) {
            throw new Error(`Product not found with ID: ${productId}`);
          }
          return product;
        }
      );
    } catch (error) {
      this.thowInfrastuctureError(error);
    }
  }

  async getAllProducts(): Promise<ProductDto[]> {
    try {
      const cachedData = await this.cache.getTable<ProductDto>(
        PricingRepositoryImp.TABLES.PRODUCTS,
        async () => {
          const products = await ProductModel.findAll();
          return products.reduce((acc, product) => {
            acc[product.productId] = product as ProductDto;
            return acc;
          }, {} as Record<string, ProductDto>);
        }
      );
      return Object.values(cachedData);
    } catch (error) {
      this.thowInfrastuctureError(error);
    }
  }

  async getPriceAgreementByKey(keys: PriceAgreementKeys): Promise<PriceAgreementDto> {
    const cacheKey = `${keys.customerCode}-${keys.productCode}`;
    return await this.cache.getRecord<PriceAgreementDto>(
      PricingRepositoryImp.TABLES.PRICE_AGREEMENTS,
      cacheKey,
      async () => await PriceAgreementModel.findByKey(keys)
    );
  }

  async getAllPriceAgreements(where?: Partial<PriceAgreementDto>): Promise<PriceAgreementDto[]> {
    if (!where) {
      const cachedData = await this.cache.getTable<PriceAgreementDto>(
        PricingRepositoryImp.TABLES.PRICE_AGREEMENTS,
        async () => {
          const agreements = await PriceAgreementModel.findAll();
          return agreements.reduce((acc, agreement) => {
            const key = `${agreement.customerCode}-${agreement.productCode}`;
            acc[key] = agreement as PriceAgreementDto;
            return acc;
          }, {} as Record<string, PriceAgreementDto>);
        }
      );
      return Object.values(cachedData);
    }
    return await PriceAgreementModel.findAll(where);
  }
}