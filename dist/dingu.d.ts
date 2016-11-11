declare namespace Rn.Utils.Dingu {
    class CircularDependencyError {
        RootItem: RegistryItem;
        DependencyChain: string[];
        message: string;
        name: string;
        /**
         * Thrown when a circular dependency is encountered.
         * @constructor
         * @param {RegistryItem} rootItem - the first item that kicked off the resolution
         * @param {string[]} dependencyChain - ordered chain of dependencies that have already been resolved
         */
        constructor(rootItem: RegistryItem, dependencyChain: string[]);
        toString(): string;
    }
}
interface Window {
    testHarness: ITestHarness;
}
interface ITestHarness {
    resetLockStatus: Function;
}
declare namespace Rn.Utils.Dingu {
    class Dingu {
        constructor();
        /**
         * Register a value in the container
         * @param {string} name
         * @param {string|Number|Object|Array} value
         */
        value(name: string, value: any): void;
        /**
         * Registers a new module
         * @param {string} name - the module's name
         * @param {Function} module - the module function
         */
        module(name: string, module: Function): void;
        /**
         * Registers a new singleton
         * @param {string} name - the singletons name
         * @param {Function} singleton - the singleton
         */
        singleton(name: string, singleton: Function): void;
        /**
         * Return a registry item.
         * @param {string} itemName
         * @param {boolean} [supressItemNotFoundError=false] true if you don't want an error to be thrown when an item is not found
         */
        get(itemName: string, supressItemNotFoundError?: boolean): any;
        /**
         * Clears out all dependencies from the DI registry
         */
        reset(): void;
        /**
         * Locks dingu and prevents any changes being made
         */
        lock(): void;
        /**
         * Resolve a registry item to an instance.
         * @param {RegistryItem} registryItem
         * @param {string[]} dependencyChain
         * @returns {MIXED} the result
         */
        resolve(registryItem: RegistryItem, dependencyChain: string[]): any;
        /**
         * Resolve an array of dependencies
         * @param {string[]} names - current list of known dependencies
         * @param {string[]} dependencyChain - complete list of known dependencies
         */
        resolveDependencies(names: string[], dependencyChain: string[]): any[];
    }
}
declare namespace Rn.Utils.Dingu {
    class ItemNotFoundError {
        Item: string;
        message: string;
        /**
         * Thrown when an item isn't present in the registry
         * @constructor
         * @param {string} item - the item name
         */
        constructor(item: string);
        toString(): string;
    }
}
declare namespace Rn.Utils.Dingu {
    class MethodInfo {
        Fn: Function;
        Args: string[];
        constructor(fn: Function, args: string[]);
    }
}
declare let dingu: Rn.Utils.Dingu.Dingu;
declare namespace Rn.Utils.Dingu {
    class RegistryItem {
        Name: string;
        Target: Function;
        Type: RegistryItemType;
        Value: any;
        DependencyNames: string[];
        /**
         * @constructor
         * @param {string} name - the name of this item
         * @param {Function} target - the target function
         * @param {RegistryItemType} registryItemType - the type of item being registered
         * @param {string[]} argumentsArray - arguments for this item
        */
        constructor(name: string, target: Function, registryItemType: RegistryItemType, argumentsArray?: string[]);
    }
}
declare namespace Rn.Utils.Dingu {
    enum RegistryItemType {
        VALUE = 0,
        SINGLETON = 1,
        INSTANCE = 2,
    }
}
declare namespace Rn.Utils.Dingu {
    class Utils {
        static FN_ARGS: RegExp;
        static STRIP_COMMENTS: RegExp;
        /**
         * @param {Function} target - the target function
         * @param {string[]} argumentsArray -
         * @returns {string[]} array of all arguments required by the target function
         */
        static getFunctionArguments(target: Function, argumentsArray: string[]): string[];
        /**
         * Helper to map a module/singleton arguments if an array was provided
         * @param {Function} methodArgument - the function to extract metadata from
         * @returns {MethodInfo} extracted metadata for the given function
         */
        static extractMethodInformation(methodArgument: Function): MethodInfo;
    }
}
