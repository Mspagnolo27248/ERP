import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { RackPriceDto } from "../data-transfer-objects/price-records-dtos";
import { RackPrice } from "../domain-entities/RackPrice";

export class GetRackPriceByKeyUseCase implements UseCase {
    private pricingRepository: PricingRepository;

    constructor(pricingRepository: PricingRepository) {
        this.pricingRepository = pricingRepository;
    }

    async execute(keys:RackPriceDto): Promise<RackPriceDto> {
        try {
            const record = await this.pricingRepository.getRackPriceByKey(keys);
            const entity = new RackPrice(record);
            return entity
        } catch (error) {         
            throw new Error('Failed to fetch rack pricing');
        }
    }
}
