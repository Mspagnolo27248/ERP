import { PricingRepository } from "../data-access-repository/PricingRepository";
import { RackPriceDto } from "../data-transfer-objects/price-records-dtos";
import { RackPrice } from "../domain-entities/RackPrice";


export class CreateRackPriceUseCase {

    constructor( private pricingResposity: PricingRepository) {
        this.pricingResposity = pricingResposity; 
    }

   public async execute(rackPriceDto: RackPriceDto): Promise<RackPriceDto> {  
        //Validate Inouts
        if(!(rackPriceDto.price>0.01&&rackPriceDto.price<99.0)){
            throw new Error('RackPrice needs to be between 0.01 & 99');
        }
        
        //Existance Check Master Data (we would check all key master data prod,cont,cust,etc...)
        const product = await this.pricingResposity.getProductById(rackPriceDto.productCode);
        if (!product) {
            throw new Error('Product not found');
        }
        
        const results = await this.pricingResposity.upsertRackPrice(rackPriceDto);
        return results

    }
}

