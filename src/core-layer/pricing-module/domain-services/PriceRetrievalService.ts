import { PricingRepository } from "../data-access-repository/PricingRepository";
import { PriceAgreementKeys, RackPriceKeys } from "../data-transfer-objects/price-records-dtos";


export class PriceRetrievalService {

    constructor(private readonly pricingRepository: PricingRepository) {}


    async execute(keys:PriceLookupKeys ): Promise<PriceDto> {
        if (!keys.unitOfMeasure) {
            throw new Error('shipToId and unitOfMeasure are required');
        }

        const priceAgreementKeys: PriceAgreementKeys  = {
            customerCode: keys.customerId,
            productCode: keys.productId,
            containerCode: keys.containerId,
            unitMeasurement: keys.unitOfMeasure,
            location: keys.location
        }
     
        const activeAgreements = await this.pricingRepository.getAllPriceAgreements(priceAgreementKeys);
  
        //filter to remove prices with effective date greater than shipdate and end date less than shipdate
        const filteredAgreements = activeAgreements.filter(agreement => 
            (agreement.startDate8Digit) <= keys.shipDate && 
           ((agreement.endDate8Digit) >= keys.shipDate || agreement.endDate8Digit === 0));

        
        if(filteredAgreements.length > 0) {
            return {
                price: parseFloat(String(filteredAgreements[0].price)),
                unitOfMeasure: activeAgreements[0].unitMeasurement,
                priceType: "Agreement"
            } as PriceDto;
         
        }

        const rackPriceKeys: RackPriceKeys = {
            productCode: keys.productId,
            containerCode: keys.containerId,
            unitOfMeasure: keys.unitOfMeasure,
        }
        const rackPrice = await this.pricingRepository.getAllRackPricing(rackPriceKeys);

        //Remove prices with effective date greater than shipdate
        const filteredRackPrice = rackPrice.filter(price => parseInt(price.effectiveDate) < keys.shipDate);

        if(filteredRackPrice.length > 0) {
            throw new Error("No rack price found");
        }
        //sort by effective date
        const sortedRackPrice = filteredRackPrice.sort((a, b) => parseInt(b.effectiveDate) - parseInt(a.effectiveDate));
        return {
            price: parseFloat(String(sortedRackPrice[0].price)),
            unitOfMeasure: sortedRackPrice[0].unitOfMeasure,
            priceType: "Rack"
        } as PriceDto;
    }
}


interface PriceLookupKeys {
    productId: string;
    containerId: string;
    unitOfMeasure: string;
    customerId: string;
    location: string;
    shipDate: number;
}


interface PriceDto {
    price: number;
    unitOfMeasure: string;
    priceType: "Rack"|"Agreement";
}


