import { DomainError, InfrastructureError } from "../../general/Errors/errors";
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
        const data = await this.fetchPricingData();
        const rackPriceEntities = this.transformToDomainEntities(data);
        return rackPriceEntities.slice(0, limit);
    }

    private async fetchPricingData(): Promise<RackPriceDto[]> {
        try {
            const data = await this.pricingRepository.getAllRackPricing();
            if (!data || data.length === 0) {
                throw new InfrastructureError("No pricing data found");
            }
            return data;
        } catch (error) {
            throw new InfrastructureError(error,"Failed to fetch rack pricing");
        }
    }

    private transformToDomainEntities(data: RackPriceDto[]): RackPrice[] {
        return data.map(item => {
            try {
                return new RackPrice(item);
            } catch (err) {
                throw new DomainError(
                    `Invalid rack price data for item: ${JSON.stringify(item)}`
                );
            }
        });
    }
}
