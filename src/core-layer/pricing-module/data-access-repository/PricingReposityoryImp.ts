import { ProductModel } from "../../../shared-common/database/custom-orm/data-models/ProductModel";
import { RackPriceModel } from "../../../shared-common/database/custom-orm/data-models/RackPriceModel";
import { ProductDto, RackPriceDto } from "../data-transfer-objects/price-records-dtos";
import { PricingRepository } from "./PricingRepository";


export class PricingRepositoryImp implements PricingRepository {



  async upsertRackPrice(rackPriceDto: RackPriceDto): Promise<RackPriceDto> {
    try {
      const results = await RackPriceModel.upsert(rackPriceDto);
      return results;
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  async getAllRackPricing(): Promise<RackPriceDto[]> {
    try {
      return await RackPriceModel.findAll() as Promise<RackPriceDto[]>;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error executing getAllRackPricing() ${error.message}`);
      }
      throw new Error("Error executing getAllRackPricing()");
    }
  }



  async getRackPriceByKey(key: { [key: string]: [keyof RackPriceDto] }): Promise<RackPriceDto> {
    try {
      return await RackPriceModel.findByKey(key);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error executing getAllRackPricing() ${error.message}`);
      }
      throw new Error("Error executing getAllRackPricing()");
    }
  }



  async deleteRackPrice(instance:RackPriceDto): Promise<RackPriceDto> {
    try {
      return await RackPriceModel.delete(instance);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error executing getAllRackPricing() ${error.message}`);
      }
      throw new Error("Error executing getAllRackPricing()");
    }
  }



  async getProductById(productId: string): Promise<ProductDto> {
    try {
      return await ProductModel.findByKey({ productId })
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting product by ID: ${error.message}`);
      }
      throw new Error(`Error getting product by ID: `);
    }
  }


  async getAllProducts(): Promise<ProductDto[]> {
    try {
      return await ProductModel.findAll();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error getting rackPriceRecords${error.message}`);
      }
      throw new Error("Errpr getting all rackprice records");
    } finally {
    }
  }




}