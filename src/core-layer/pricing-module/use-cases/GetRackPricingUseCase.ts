import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { RackPriceDto } from "../data-transfer-objects/price-records-dtos";
import { RackPrice } from "../domain-entities/RackPrice";

export class GetRackPricingUseCase implements UseCase {
    private pricingRepository: PricingRepository;

    constructor(pricingRepository: PricingRepository) {
        this.pricingRepository = pricingRepository;
    }

    async execute(limit = 5000): Promise<RackPriceDto[]> {
        try {
            const data = await this.pricingRepository.getAllRackPricing();
            const rackPriceEntities = data.map(item=> new RackPrice(item))
            return rackPriceEntities.slice(0, limit);
        } catch (error) {         
            throw new Error('Failed to fetch rack pricing');
        }
    }
}
