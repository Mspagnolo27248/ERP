import { CustomerDto } from "../../order-entry/data-access-repository/order-entry-dtos";



export interface CustomerRepository {
    getAllCustomers(): Promise<CustomerDto[]>;
    getCustomerById(customerId: number): Promise<CustomerDto>;
//     createCustomer(customer: CustomerDto): Promise<CustomerDto>;
//     updateCustomer(customer: CustomerDto): Promise<CustomerDto>;
//     deleteCustomer(customerId: string): Promise<void>;
 }
