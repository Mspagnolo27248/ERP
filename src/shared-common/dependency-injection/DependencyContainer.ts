type Factory<T> = () => T;

// Define a map of keys to their corresponding types
interface DependencyMap {
  [key: string]: any;
}

export class DIContainer<T extends DependencyMap = {}> {
  private static instance: DIContainer<any>;
  private factories = new Map<keyof T, Factory<any>>();
  private instances = new Map<keyof T, any>();

  private constructor() {}

  static getInstance<T extends DependencyMap>(): DIContainer<T> {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer<T>();
    }
    return DIContainer.instance;
  }

  // Register a factory for a dependency
  register<K extends keyof T>(key: K, factory: Factory<T[K]>) {
    if (this.factories.has(key)) {
      throw new Error(`Dependency "${String(key)}" is already registered`);
    }
    this.factories.set(key, factory);
    return this;
  }

  // Resolve a dependency by its key
  resolve<K extends keyof T>(key: K): T[K] {
    // Check if we already have an instance
    const existingInstance = this.instances.get(key);
    if (existingInstance) {
      return existingInstance;
    }

    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`Dependency "${String(key)}" is not registered`);
    }

    try {
      const instance = factory();
      this.instances.set(key, instance);
      return instance;
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      throw new Error(`Error creating instance for "${String(key)}": ${error}`);
    }
  }

  // Clear all registrations and instances
  clear() {
    this.factories.clear();
    this.instances.clear();
  }

  // Check if a dependency is registered
  has(key: keyof T): boolean {
    return this.factories.has(key);
  }
}


