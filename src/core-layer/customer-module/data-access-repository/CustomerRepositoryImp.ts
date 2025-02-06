import { CustomerAccountModel } from "../../../shared-common/database/custom-orm/data-models/CustomerModel";
import { MasterDataCache } from "../../../shared-common/data-cache/MasterDataCache";
import { Repository } from "../../general/Repository";
import { CustomerDto } from "../../order-entry/data-access-repository/order-entry-dtos";
import { CustomerRepository } from "./CustomerRepository";




export class CustomerRepositoryImp extends Repository implements CustomerRepository {
  private cache = MasterDataCache.getInstance();

  async getAllCustomers(): Promise<CustomerDto[]> {
    try {
      return await this.cache.getOrFetch('customers', async () => {
        return await CustomerAccountModel.findAll();
      });
    } catch (error) {
      this.thowInfrastuctureError(error);
    }
  }

  async getCustomerById(customerId: number): Promise<CustomerDto> {
    try {
      const customers = await this.getAllCustomers();
      const customer = customers.find(c => c.customerNumber === customerId);
      if (!customer) {
        throw new Error(`Customer not found with ID: ${customerId}`);
      }
      return customer;
    } catch (error) {
      this.thowInfrastuctureError(error);
    }
  }
} 