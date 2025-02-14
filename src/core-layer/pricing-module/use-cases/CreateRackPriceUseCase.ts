import { UseCase } from "../../general/UseCase";
import { PricingRepository } from "../data-access-repository/PricingRepository";
import { RackPriceDto } from "../data-transfer-objects/price-records-dtos";
import { RackPrice } from "../domain-entities/RackPrice";



export class CreateRackPriceUseCase extends UseCase {

    constructor(private pricingResposity: PricingRepository) {
        super();
        this.pricingResposity = pricingResposity;
    }


    public async execute(rackPriceDto: RackPriceDto): Promise<RackPrice> {
        try {
        
            this.validateInputs(rackPriceDto);

            //Existance Check Master Data (we would check all key master data prod,cont,cust,etc...)    
            const product = await this.pricingResposity.getProductById(rackPriceDto.productCode);
            if (!product) {
                throw this.throwApplicationError(`Product Does not exist for ${rackPriceDto.productCode}`)
            }

            //Convert DTO to Domain Entity runs the Domain specific business rules. --Use-case should return Entity incase there are dynamically created fields. ie. CUR/FUT/CF
            const rackPriceEntity = new RackPrice(rackPriceDto).toDTO();

            //Database interactions abstracted via Data-Access-Repo Interface
            const record = await this.pricingResposity.upsertRackPrice(rackPriceEntity);        
         
            return rackPriceEntity;

        } catch (error) {
            this.throwApplicationError(error)
        }

    }


    private validateInputs(rackPriceDto: RackPriceDto): void {

          // Business Rule: Effective Date is valid date.
          if(!this.isValidDate(rackPriceDto.effectiveDate)){
            throw this.throwApplicationError(`Effective date is invalid : ${rackPriceDto.effectiveDate}`)
          }


        // Business Rule: Price should be within the range
        if (!(rackPriceDto.price > 0.01 && rackPriceDto.price < 99.0)) {
            throw this.throwApplicationError('Rack price must be between 0.01 and 99.0');
        }

        // Business Rule: Effective date must be in the future
        if (this.isPastDate(rackPriceDto.effectiveDate)) {
            throw this.throwApplicationError('Effective date must be greater than today');
        }

        // Business Rule: Effective time must be between 0 and 2400
        if (!(rackPriceDto.effectiveTime >= 0 && rackPriceDto.effectiveTime <= 2400)) {
            throw this.throwApplicationError('Effective time must be between 0 and 2400');
        }



    }

    private isPastDate(effectiveDate: number) {
        return effectiveDate <= this.getTodayAsInt();


    }

    private getTodayAsInt(): number {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2 digits
        const day = today.getDate().toString().padStart(2, '0'); // Ensure 2 digits

        return parseInt(`${year}${month}${day}`, 10);
    }

    private isValidDate(intDate:number){
         // Convert integer to string
    const dateStr = intDate.toString();

    // Regular expression to match YYYYMMDD format
    const dateRegex = /^(20\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;

    // Test against the regex
    const match = dateStr.match(dateRegex);
    if (!match) return false;

    // Extract year, month, and day
    const [, year, month, day] = match.map(Number);

    // Validate the actual date using JavaScript's Date object
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && (date.getMonth() + 1) === month && date.getDate() === day;

    }

}


