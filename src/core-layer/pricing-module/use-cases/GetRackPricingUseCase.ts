import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { RackPriceDto } from "../data-transfer-objects/price-records-dtos";
import { RackPrice } from "../domain-entities/RackPrice";


export class GetRackPricingUseCase extends UseCase {
    private pricingRepository: PricingRepository;

    constructor(pricingRepository: PricingRepository) {
        super();
        this.pricingRepository = pricingRepository;
    }

    async execute(filter?: Partial<RackPriceDto>, limit = 5000): Promise<RackPriceDto[]> {
        try {
            const data = await this.pricingRepository.getAllRackPricing();

            const filteredData = filter ? this.applyFilter(data, filter) : data;

            const rackPriceEntities = this.transformToDomainEntities(filteredData);

            return rackPriceEntities.slice(0, limit);

        } catch (error) {
            if (error instanceof Error) throw error
            this.throwApplicationError('GetRackPricingUseCase Failed to complete')
        }
    }


    private transformToDomainEntities(data: RackPriceDto[]): RackPrice[] {
        return data.map(item => {
            return new RackPrice(item).toDTO(); // Return the DTO instead of the entity to avoid exposing the internal structure of the entity   
        });
    }

    private applyFilter(data: RackPriceDto[], filter: Partial<RackPriceDto>): RackPriceDto[] {
        if (!filter || Object.keys(filter).length === 0) {
            return data;
        }

        return data.filter(record => {
            return Object.entries(filter).every(([key, value]) => {
                const recordValue = record[key as keyof RackPriceDto];

                // Check if the value is a string and perform case-insensitive comparison
                if (typeof recordValue === 'string' && typeof value === 'string') {
                    return recordValue.toLowerCase() === value.toLowerCase();
                }

                // Handle potential type mismatches (e.g., string vs number)
                if (typeof recordValue === 'number' && typeof value === 'string') {
                    return recordValue === Number(value);
                }

                // Handle partial string matching (optional)
                if (typeof recordValue === 'string' && typeof value === 'string') {
                    return recordValue.toLowerCase().includes(value.toLowerCase());
                }

                // Default equality check for other types
                return recordValue === value;
            });
        });
    }

}



