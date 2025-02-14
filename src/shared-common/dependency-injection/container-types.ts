import { OrderRepository } from "../../core-layer/example-module/data-access-repository/Repository";
import { PricingRepository } from "../../core-layer/pricing-module/data-access-repository/PricingRepository";
import { CreateRackPriceUseCase } from "../../core-layer/pricing-module/use-cases/CreateRackPriceUseCase";
import { DeleteRackPriceUseCase } from "../../core-layer/pricing-module/use-cases/DeleteRackPriceUseCase";
import { GetProductByIdUseCase } from "../../core-layer/pricing-module/use-cases/GetProductByIdUseCase";
import { GetProductUseCase } from "../../core-layer/pricing-module/use-cases/GetProductsUseCase";
import { GetRackPriceByKeyUseCase } from "../../core-layer/pricing-module/use-cases/GetRackPriceByKeyUseCase";
import { GetRackPricingUseCase } from "../../core-layer/pricing-module/use-cases/GetRackPricingUseCase";

 type PricingModuleContainerTypes = {
    PricingRepository: PricingRepository,
    GetProductByIdUseCase: GetProductByIdUseCase,
    GetProductUseCase: GetProductUseCase,
    GetRackPricingUseCase: GetRackPricingUseCase,
    GetRackPriceByKeyUseCase: GetRackPriceByKeyUseCase,
    CreateRackPriceUseCase:CreateRackPriceUseCase,
    DeleteRackPriceUseCase:DeleteRackPriceUseCase
  };


  type OrderModuleContainerTypes = {
    OrderRepository: OrderRepository
  };


  export type DependencyContainerTypes = 
  PricingModuleContainerTypes & 
  OrderModuleContainerTypes