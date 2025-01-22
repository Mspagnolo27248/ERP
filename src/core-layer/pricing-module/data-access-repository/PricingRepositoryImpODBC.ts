
import { ProductDto, RackPriceDto } from '../data-transfer-objects/price-records-dtos'
import { PricingRepository } from './PricingRepository'
import { ProductModel } from '../../../shared-common/database/custom-orm/data-models/ProductModel';
import { RackPriceModel } from '../../../shared-common/database/custom-orm/data-models/RackPriceModel';




export class PricingRepositoryImpODBC implements PricingRepository {

    async getAllProducts(): Promise<ProductDto[]> {
       
        try{
          return  await ProductModel.findAll()                  
        }
        catch(err){
            throw err   
    }
    }

  async   getProductById(productId: string): Promise<ProductDto> {
        try {
            return  await ProductModel.findByKey({productId})
        } catch (error) {
            throw new Error(JSON.stringify(error));
        }
    }

  async   getAllRackPricing(): Promise<RackPriceDto[]> {
        try {
            return  await RackPriceModel.findAll();          
        } catch (error) {
            throw new Error(JSON.stringify(error));
        }
    }

   async  getRackPriceByKey(keys: Partial<RackPriceDto>): Promise<RackPriceDto> {
        try {
            return RackPriceModel.findByKey(keys)
        } catch (error) {
            throw new Error(JSON.stringify(error));
        }
    }


    deleteRackPrice(instance: RackPriceDto): Promise<RackPriceDto> {
        try {            
            return Promise.resolve({} as RackPriceDto);
        } catch (error) {
            throw new Error(JSON.stringify(error));
        }
    }        


    async upsertRackPrice(rackPriceDto: RackPriceDto): Promise<RackPriceDto> {
        try {            
            return Promise.resolve({} as RackPriceDto);
        } catch (error) {
            throw new Error(JSON.stringify(error));
        }
    }


}



// export async function odbc_query(){
//     const CONNECTION_STRING = 'DSN=AS400;UID=MSTEST;PWD=MSTEST';
//     try{
//         const conn = await odbc.connect(CONNECTION_STRING);
//         const results = await conn.query("select * from GINFRMP")
//         conn.close();
//         return results        
//     }
//     catch(err){
//         throw err   
// }
// }


// export async function odbc_proc(procName:string,params:any[]){
//     const CONNECTION_STRING = 'DSN=AS400;UID=MSTEST;PWD=MSTEST';
//     try{
//         const conn = await odbc.connect(CONNECTION_STRING);
//         const results = await conn.callProcedure(null,null,`${procName}`,params)
//         return results        
//     }
//     catch(err){
//         throw err
//     }   
// }