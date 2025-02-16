import { DIContainer } from "./DependencyContainer";
import { registerOrderModuleDependencies, OrderModuleContainerTypes } from "./module-registrations/order-entry-dependencies";
import { registerPricingModuleDependencies, PricingModuleContainerTypes } from "./module-registrations/pricing-dependencies";
import { registerCoreDependencies, CoreModuleContainerTypes } from "./module-registrations/core-dependencies";

// Consolidated container types
export type DependencyContainerTypes = 
  CoreModuleContainerTypes & 
  PricingModuleContainerTypes & 
  OrderModuleContainerTypes;

// Get the singleton container instance
export const container = DIContainer.getInstance<DependencyContainerTypes>();

// Register all module dependencies
export function registerDependencies() {
  try {
    // Clear any existing registrations
    container.clear();

    // Register core dependencies first
    registerCoreDependencies(container);

    // Register module dependencies in order of dependencies
    registerPricingModuleDependencies(container);
    registerOrderModuleDependencies(container);

    validateRegistrations();
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to register dependencies: ${error}`);
  }
}

// Validate that all required dependencies are registered
function validateRegistrations() {
  const requiredDependencies: (keyof DependencyContainerTypes)[] = [
    "MasterDataCache",
    "PricingRepository",
    "OrderRepository"
  ];

  for (const dep of requiredDependencies) {
    if (!container.has(dep)) {
      throw new Error(`Required dependency "${String(dep)}" is not registered`);
    }
  }
}




  

