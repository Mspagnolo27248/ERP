
import { MasterDataCache } from "../../core-layer/general/MasterDataCache";
import { OrderModuleContainerTypes } from "./module-registrations/order-entry-dependencies";
import { PricingModuleContainerTypes } from "./module-registrations/pricing-dependencies";

 
 type DataCache = {
    MasterDataCache: MasterDataCache
}
// 


  export type DependencyContainerTypes = 
  DataCache & 
  PricingModuleContainerTypes & 
  OrderModuleContainerTypes