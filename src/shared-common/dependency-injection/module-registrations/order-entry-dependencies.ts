
import { OrderRepository } from "../../../core-layer/example-module/data-access-repository/Repository";
import { OrderRepositoryImp } from "../../../core-layer/example-module/data-access-repository/RepositoryImp";
import { DIContainer } from "../DependencyContainer";

export type OrderModuleContainerTypes = {
    OrderRepository: OrderRepository
}

export function registerOrderModuleDependencies<T extends OrderModuleContainerTypes>(container: DIContainer<T>) {
    container.register("OrderRepository", () => new OrderRepositoryImp());
    return container;
}
