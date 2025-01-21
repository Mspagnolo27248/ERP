import { PricingRepository } from "../../core-layer/pricing-module/data-access-repository/PricingRepository";
import { PricingRepositoryImp } from "../../core-layer/pricing-module/data-access-repository/PricingReposityoryImp";
import { CreateRackPriceUseCase } from "../../core-layer/pricing-module/use-cases/CreateRackPriceUseCase";
import { DeleteRackPriceUseCase } from "../../core-layer/pricing-module/use-cases/DeleteRackPriceUseCase";
import { GetProductByIdUseCase } from "../../core-layer/pricing-module/use-cases/GetProductByIdUseCase";
import { GetProductUseCase } from "../../core-layer/pricing-module/use-cases/GetProductsUseCase";
import { GetRackPriceByKeyUseCase } from "../../core-layer/pricing-module/use-cases/GetRackPriceByKeyUseCase";
import { GetRackPricingUseCase } from "../../core-layer/pricing-module/use-cases/GetRackPricingUseCase";
import { DIContainer } from "./DependencyContainer";

// Export the container with a specific dependency map
  export const container = new DIContainer<{
    //Repository
    PricingRepository: PricingRepository,
  
    //UseCases
    GetProductByIdUseCase: GetProductByIdUseCase,
    GetProductUseCase: GetProductUseCase,
    GetRackPricingUseCase:GetRackPricingUseCase,
    GetRackPriceByKeyUseCase:GetRackPriceByKeyUseCase,
    CreateRackPriceUseCase:CreateRackPriceUseCase,
    DeleteRackPriceUseCase:DeleteRackPriceUseCase
  }>();

/*
// Registar dependency injection for Repository, Services, and UseCases.
// these will be resolved in the REST API Controllers. 
//
*/
  export function registerDependencies(){

    //Repository
    container.register("PricingRepository", () => new PricingRepositoryImp());

    //UseCases
    container.register("GetProductByIdUseCase", () => new GetProductByIdUseCase(container.resolve("PricingRepository")));
    container.register("GetProductUseCase", () => new GetProductUseCase(container.resolve("PricingRepository")));
    container.register("GetRackPricingUseCase",()=>new GetRackPricingUseCase(container.resolve("PricingRepository")))
    container.register("GetRackPriceByKeyUseCase",()=>new GetRackPriceByKeyUseCase(container.resolve("PricingRepository")))
    container.register("CreateRackPriceUseCase",()=>new CreateRackPriceUseCase(container.resolve("PricingRepository")))
    container.register("DeleteRackPriceUseCase",()=> new DeleteRackPriceUseCase(container.resolve("PricingRepository")))
  }



  

