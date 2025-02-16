import { PricingRepository } from "../../../core-layer/pricing-module/data-access-repository/PricingRepository";
import { PricingRepositoryImp } from "../../../core-layer/pricing-module/data-access-repository/PricingReposityoryImp";
import { GetProductByIdUseCase } from "../../../core-layer/pricing-module/use-cases/GetProductByIdUseCase";
import { GetProductUseCase } from "../../../core-layer/pricing-module/use-cases/GetProductsUseCase";
import { GetRackPriceByKeyUseCase } from "../../../core-layer/pricing-module/use-cases/GetRackPriceByKeyUseCase";
import { GetRackPricingUseCase } from "../../../core-layer/pricing-module/use-cases/GetRackPricingUseCase";
import { DIContainer } from "../DependencyContainer";
import { CoreModuleContainerTypes } from "./core-dependencies";

export type PricingModuleContainerTypes = {
    PricingRepository: PricingRepository,
    GetProductByIdUseCase: GetProductByIdUseCase,
    GetProductUseCase: GetProductUseCase,
    GetRackPricingUseCase: GetRackPricingUseCase,
    GetRackPriceByKeyUseCase: GetRackPriceByKeyUseCase
};
  
export function registerPricingModuleDependencies<T extends PricingModuleContainerTypes & CoreModuleContainerTypes>(container: DIContainer<T>) {  
    //Register Repositories
    container.register("PricingRepository", () => new PricingRepositoryImp(container.resolve("MasterDataCache")));

    //Register Use Cases
    container.register("GetProductByIdUseCase", () => new GetProductByIdUseCase(container.resolve("PricingRepository")));
    container.register("GetProductUseCase", () => new GetProductUseCase(container.resolve("PricingRepository")));
    container.register("GetRackPricingUseCase",()=>new GetRackPricingUseCase(container.resolve("PricingRepository")));
    container.register("GetRackPriceByKeyUseCase",()=>new GetRackPriceByKeyUseCase(container.resolve("PricingRepository")));
  
    return container;
}