import { MasterDataCache } from "../../../core-layer/general/MasterDataCache";
import { MasterDataCacheImp } from "../../data-cache/MasterDataCacheImp";
import { DIContainer } from "../DependencyContainer";

export type CoreModuleContainerTypes = {
    MasterDataCache: MasterDataCache;
    // Add other shared repositories and services here
};

export function registerCoreDependencies<T extends CoreModuleContainerTypes>(container: DIContainer<T>) {
    // Register core shared dependencies
    container.register("MasterDataCache", () => MasterDataCacheImp.getInstance());

    return container;
} 