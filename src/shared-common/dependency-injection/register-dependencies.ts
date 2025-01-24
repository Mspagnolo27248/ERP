import { DIContainer } from "./DependencyContainer";
import { DependencyContainerTypes } from "./container-types";
import { registerOrderModuleDependencies } from "./module-registrations/order-entry-dependencies";
import { registerPricingModuleDependencies } from "./module-registrations/pricing-dependencies";




  export const container = new DIContainer<DependencyContainerTypes>();

  export function registerDependencies(){
    registerPricingModuleDependencies(container)  
    registerOrderModuleDependencies(container)
  }



  

