import { ProductModel } from "../../../shared-common/database/custom-orm/data-models/ProductModel";
import { RackPriceModel } from "../../../shared-common/database/custom-orm/data-models/RackPriceModel";
import { Repository } from "../../general/Repository";
import { ProductDto, RackPriceDto } from "../data-transfer-objects/price-records-dtos";
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



export class PricingRepositoryImp  extends Repository implements PricingRepository {


  async getAllRackPricing(): Promise<RackPriceDto[]> { 
    try {     
      return await RackPriceModel.findAll() as Promise<RackPriceDto[]>;  
    } catch (error) {
      this.thowInfrastuctureError(error);
    }
  
  }


  async getRackPriceByKey(keys:Partial<RackPriceDto>): Promise<RackPriceDto> { 
    try {
      return await RackPriceModel.findByKey(keys);   
    } catch (error) {
      this.thowInfrastuctureError(error);
    }
  }


  async getProductById(productId: string): Promise<ProductDto> {
      return await ProductModel.findByKey({ productId })
  }


  async getAllProducts(): Promise<ProductDto[]> {
      return await ProductModel.findAll();  
  }

    // async upsertRackPrice(rackPriceDto: RackPriceDto): Promise<RackPriceDto> {
  //   try {
  //     const results = await RackPriceModel.upsert(rackPriceDto);
  //     return results;
  //   } catch (error) {
  //     throw new Error(JSON.stringify(error));
  //   }
  // }


    // async deleteRackPrice(instance:RackPriceDto): Promise<RackPriceDto> {
  //   try {
  //     return await RackPriceModel.delete(instance);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw new Error(`Error executing getAllRackPricing() ${error.message}`);
  //     }
  //     throw new Error("Error executing getAllRackPricing()");
  //   }
  // }



}