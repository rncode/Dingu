interface Window { testHarness: ITestHarness }
interface ITestHarness { resetLockStatus: Function }

namespace Rn.Utils.Dingu {
    // todo: pull these properties back into the dingu class
    let Locked: boolean = false;
    let Registry: any = {}; // todo: make more strict

    export class Dingu {
        public constructor() {
            // Give the test harness a way to reset the lock status
            if (window.testHarness) {
                window.testHarness.resetLockStatus = function () {
                    Locked = false;
                };
            }
        }

        /**
         * Register a value in the container
         * @param {string} name
         * @param {string|Number|Object|Array} value
         */
        public value(name: string, value: any) {
            if (Locked) { return; } // todo: <logging> Logging later on

            Registry[name] = new RegistryItem(name, value, RegistryItemType.VALUE);
        }

        /**
         * Registers a new module
         * @param {string} name - the module's name
         * @param {Function} module - the module function
         */
        public module(name: string, module: Function) {
            if (Locked) { return; } // todo: <logging> Logging later on

            var moduleInfo = Utils.extractMethodInformation(module);
            Registry[name] = new RegistryItem(name, moduleInfo.Fn, RegistryItemType.INSTANCE, moduleInfo.Args);
        }

        /**
         * Registers a new singleton
         * @param {string} name - the singletons name
         * @param {Function} singleton - the singleton
         */
        public singleton(name: string, singleton: Function) {
            if (Locked) { return; } // todo: <logging> Logging later on

            var singletonInfo = Utils.extractMethodInformation(singleton);
            Registry[name] = new RegistryItem(name, singletonInfo.Fn, RegistryItemType.SINGLETON, singletonInfo.Args);
        }

        /**
         * Return a registry item.
         * @param {string} itemName
         * @param {boolean} [supressItemNotFoundError=false] true if you don't want an error to be thrown when an item is not found
         */
        public get(itemName: string, supressItemNotFoundError: boolean = false) {
            if (!Registry.hasOwnProperty(itemName)) {
                if (supressItemNotFoundError) {
                    return undefined;
                } else {
                    throw new ItemNotFoundError(itemName);
                }
            }

            return this.resolve(Registry[itemName], []);
        }

        /**
         * Clears out all dependencies from the DI registry
         */
        public reset() {
            if (Locked) { return; } // todo: <logging> Logging later on

            Registry = {};
        }

        /**
         * Locks dingu and prevents any changes being made
         */
        public lock() {
            Locked = true;
        }

        /**
         * Resolve a registry item to an instance.
         * @param {RegistryItem} registryItem
         * @param {string[]} dependencyChain
         * @returns {MIXED} the result
         */
        public resolve(registryItem: RegistryItem, dependencyChain: string[]) {
            // check for circular dependencies
            dependencyChain.forEach(function (dependency) {
                if (dependency === registryItem.Name) {
                    throw new CircularDependencyError(registryItem, dependencyChain);
                }
            });

            var dependencies;
            switch (registryItem.Type) {
                case RegistryItemType.VALUE:
                    // nothing to do - this was set already
                    break;

                case RegistryItemType.SINGLETON:
                    if (!registryItem.Value) {
                        dependencies = this.resolveDependencies(registryItem.DependencyNames, dependencyChain.concat(registryItem.Name));
                        registryItem.Value = registryItem.Target.apply(registryItem.Target, dependencies);
                    }
                    break;

                case RegistryItemType.INSTANCE:
                    dependencies = this.resolveDependencies(registryItem.DependencyNames, dependencyChain.concat(registryItem.Name));
                    registryItem.Value = registryItem.Target.apply(registryItem.Target, dependencies);
                    break;
            }

            return registryItem.Value;
        }

        /**
         * Resolve an array of dependencies
         * @param {string[]} names - current list of known dependencies 
         * @param {string[]} dependencyChain - complete list of known dependencies
         */
        public resolveDependencies(names: string[], dependencyChain: string[]) {
            var me = this;
            names = names || [];

            return names.map(function (name) {
                if (!Registry.hasOwnProperty(name)) {
                    throw new Error('Failed to resolve dependency. Could not find a module called ' + name);
                }

                return me.resolve(Registry[name], dependencyChain);
            });
        }
    }
}