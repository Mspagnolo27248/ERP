import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { RackPriceDto } from "../data-transfer-objects/price-records-dtos";

export class GetRackPriceByKeyUseCase implements UseCase {
    private pricingRepository: PricingRepository;

    constructor(pricingRepository: PricingRepository) {
        this.pricingRepository = pricingRepository;
    }

    async execute(key:RackPriceDto): Promise<RackPriceDto> {
        try {
            const data = await this.pricingRepository.getAllRackPricing();
            return data[0];
        } catch (error) {         
            throw new Error('Failed to fetch rack pricing');
        }
    }
}
