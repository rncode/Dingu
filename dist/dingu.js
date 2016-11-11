var Rn;
(function (Rn) {
    var Utils;
    (function (Utils) {
        var Dingu;
        (function (Dingu) {
            var CircularDependencyError = (function () {
                /**
                 * Thrown when a circular dependency is encountered.
                 * @constructor
                 * @param {RegistryItem} rootItem - the first item that kicked off the resolution
                 * @param {string[]} dependencyChain - ordered chain of dependencies that have already been resolved
                 */
                function CircularDependencyError(rootItem, dependencyChain) {
                    this.RootItem = rootItem;
                    this.DependencyChain = dependencyChain;
                    this.name = "CircularDependencyError";
                    this.message = 'Calling ' +
                        rootItem.Name +
                        ' resolved a dependency that depends on this item. Chain: ' +
                        dependencyChain.join('->') +
                        '->' +
                        rootItem.Name;
                }
                CircularDependencyError.prototype.toString = function () {
                    return this.message;
                };
                return CircularDependencyError;
            }());
            Dingu.CircularDependencyError = CircularDependencyError;
        })(Dingu = Utils.Dingu || (Utils.Dingu = {}));
    })(Utils = Rn.Utils || (Rn.Utils = {}));
})(Rn || (Rn = {}));
var Rn;
(function (Rn) {
    var Utils;
    (function (Utils) {
        var Dingu;
        (function (Dingu_1) {
            // todo: pull these properties back into the dingu class
            var Locked = false;
            var Registry = {}; // todo: make more strict
            var Dingu = (function () {
                function Dingu() {
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
                Dingu.prototype.value = function (name, value) {
                    if (Locked) {
                        return;
                    } // todo: <logging> Logging later on
                    Registry[name] = new Dingu_1.RegistryItem(name, value, Dingu_1.RegistryItemType.VALUE);
                };
                /**
                 * Registers a new module
                 * @param {string} name - the module's name
                 * @param {Function} module - the module function
                 */
                Dingu.prototype.module = function (name, module) {
                    if (Locked) {
                        return;
                    } // todo: <logging> Logging later on
                    var moduleInfo = Dingu_1.Utils.extractMethodInformation(module);
                    Registry[name] = new Dingu_1.RegistryItem(name, moduleInfo.Fn, Dingu_1.RegistryItemType.INSTANCE, moduleInfo.Args);
                };
                /**
                 * Registers a new singleton
                 * @param {string} name - the singletons name
                 * @param {Function} singleton - the singleton
                 */
                Dingu.prototype.singleton = function (name, singleton) {
                    if (Locked) {
                        return;
                    } // todo: <logging> Logging later on
                    var singletonInfo = Dingu_1.Utils.extractMethodInformation(singleton);
                    Registry[name] = new Dingu_1.RegistryItem(name, singletonInfo.Fn, Dingu_1.RegistryItemType.SINGLETON, singletonInfo.Args);
                };
                /**
                 * Return a registry item.
                 * @param {string} itemName
                 * @param {boolean} [supressItemNotFoundError=false] true if you don't want an error to be thrown when an item is not found
                 */
                Dingu.prototype.get = function (itemName, supressItemNotFoundError) {
                    if (supressItemNotFoundError === void 0) { supressItemNotFoundError = false; }
                    if (!Registry.hasOwnProperty(itemName)) {
                        if (supressItemNotFoundError) {
                            return undefined;
                        }
                        else {
                            throw new Dingu_1.ItemNotFoundError(itemName);
                        }
                    }
                    return this.resolve(Registry[itemName], []);
                };
                /**
                 * Clears out all dependencies from the DI registry
                 */
                Dingu.prototype.reset = function () {
                    if (Locked) {
                        return;
                    } // todo: <logging> Logging later on
                    Registry = {};
                };
                /**
                 * Locks dingu and prevents any changes being made
                 */
                Dingu.prototype.lock = function () {
                    Locked = true;
                };
                /**
                 * Resolve a registry item to an instance.
                 * @param {RegistryItem} registryItem
                 * @param {string[]} dependencyChain
                 * @returns {MIXED} the result
                 */
                Dingu.prototype.resolve = function (registryItem, dependencyChain) {
                    // check for circular dependencies
                    dependencyChain.forEach(function (dependency) {
                        if (dependency === registryItem.Name) {
                            throw new Dingu_1.CircularDependencyError(registryItem, dependencyChain);
                        }
                    });
                    var dependencies;
                    switch (registryItem.Type) {
                        case Dingu_1.RegistryItemType.VALUE:
                            // nothing to do - this was set already
                            break;
                        case Dingu_1.RegistryItemType.SINGLETON:
                            if (!registryItem.Value) {
                                dependencies = this.resolveDependencies(registryItem.DependencyNames, dependencyChain.concat(registryItem.Name));
                                registryItem.Value = registryItem.Target.apply(registryItem.Target, dependencies);
                            }
                            break;
                        case Dingu_1.RegistryItemType.INSTANCE:
                            dependencies = this.resolveDependencies(registryItem.DependencyNames, dependencyChain.concat(registryItem.Name));
                            registryItem.Value = registryItem.Target.apply(registryItem.Target, dependencies);
                            break;
                    }
                    return registryItem.Value;
                };
                /**
                 * Resolve an array of dependencies
                 * @param {string[]} names - current list of known dependencies
                 * @param {string[]} dependencyChain - complete list of known dependencies
                 */
                Dingu.prototype.resolveDependencies = function (names, dependencyChain) {
                    var me = this;
                    names = names || [];
                    return names.map(function (name) {
                        if (!Registry.hasOwnProperty(name)) {
                            throw new Error('Failed to resolve dependency. Could not find a module called ' + name);
                        }
                        return me.resolve(Registry[name], dependencyChain);
                    });
                };
                return Dingu;
            }());
            Dingu_1.Dingu = Dingu;
        })(Dingu = Utils.Dingu || (Utils.Dingu = {}));
    })(Utils = Rn.Utils || (Rn.Utils = {}));
})(Rn || (Rn = {}));
var Rn;
(function (Rn) {
    var Utils;
    (function (Utils) {
        var Dingu;
        (function (Dingu) {
            var ItemNotFoundError = (function () {
                /**
                 * Thrown when an item isn't present in the registry
                 * @constructor
                 * @param {string} item - the item name
                 */
                function ItemNotFoundError(item) {
                    this.Item = item;
                    this.message = 'Item not found: ' + item + ' - was it registered?';
                }
                ItemNotFoundError.prototype.toString = function () {
                    return this.message;
                };
                return ItemNotFoundError;
            }());
            Dingu.ItemNotFoundError = ItemNotFoundError;
        })(Dingu = Utils.Dingu || (Utils.Dingu = {}));
    })(Utils = Rn.Utils || (Rn.Utils = {}));
})(Rn || (Rn = {}));
var Rn;
(function (Rn) {
    var Utils;
    (function (Utils) {
        var Dingu;
        (function (Dingu) {
            var MethodInfo = (function () {
                function MethodInfo(fn, args) {
                    this.Fn = fn;
                    this.Args = args;
                }
                return MethodInfo;
            }());
            Dingu.MethodInfo = MethodInfo;
        })(Dingu = Utils.Dingu || (Utils.Dingu = {}));
    })(Utils = Rn.Utils || (Rn.Utils = {}));
})(Rn || (Rn = {}));
var dingu = new Rn.Utils.Dingu.Dingu();
var Rn;
(function (Rn) {
    var Utils;
    (function (Utils) {
        var Dingu;
        (function (Dingu) {
            var RegistryItem = (function () {
                /**
                 * @constructor
                 * @param {string} name - the name of this item
                 * @param {Function} target - the target function
                 * @param {RegistryItemType} registryItemType - the type of item being registered
                 * @param {string[]} argumentsArray - arguments for this item
                */
                function RegistryItem(name, target, registryItemType, argumentsArray) {
                    if (argumentsArray === void 0) { argumentsArray = null; }
                    this.Name = name;
                    this.Target = target;
                    this.Type = registryItemType;
                    this.Value = registryItemType === Dingu.RegistryItemType.VALUE ?
                        target :
                        null;
                    this.DependencyNames = registryItemType !== Dingu.RegistryItemType.VALUE ?
                        Dingu.Utils.getFunctionArguments(target, argumentsArray) :
                        null;
                }
                return RegistryItem;
            }());
            Dingu.RegistryItem = RegistryItem;
        })(Dingu = Utils.Dingu || (Utils.Dingu = {}));
    })(Utils = Rn.Utils || (Rn.Utils = {}));
})(Rn || (Rn = {}));
var Rn;
(function (Rn) {
    var Utils;
    (function (Utils) {
        var Dingu;
        (function (Dingu) {
            (function (RegistryItemType) {
                RegistryItemType[RegistryItemType["VALUE"] = 0] = "VALUE";
                RegistryItemType[RegistryItemType["SINGLETON"] = 1] = "SINGLETON";
                RegistryItemType[RegistryItemType["INSTANCE"] = 2] = "INSTANCE";
            })(Dingu.RegistryItemType || (Dingu.RegistryItemType = {}));
            var RegistryItemType = Dingu.RegistryItemType;
        })(Dingu = Utils.Dingu || (Utils.Dingu = {}));
    })(Utils = Rn.Utils || (Rn.Utils = {}));
})(Rn || (Rn = {}));
var Rn;
(function (Rn) {
    var Utils;
    (function (Utils_1) {
        var Dingu;
        (function (Dingu) {
            var Utils = (function () {
                function Utils() {
                }
                /**
                 * @param {Function} target - the target function
                 * @param {string[]} argumentsArray -
                 * @returns {string[]} array of all arguments required by the target function
                 */
                Utils.getFunctionArguments = function (target, argumentsArray) {
                    var args = [];
                    var names = [];
                    // generate a list of all parameters going into the target function
                    args = argumentsArray || target.toString()
                        .match(this.FN_ARGS)[1]
                        .split(',');
                    // go through each name and strip comments
                    var me = this;
                    args.forEach(function (arg) {
                        var comments = arg.match(me.STRIP_COMMENTS);
                        if (comments !== null) {
                            for (var index = 0; index < comments.length; index++) {
                                arg = arg.replace(comments[index], '');
                            }
                        }
                        arg = arg.trim();
                        if (arg !== '') {
                            names.push(arg);
                        }
                    });
                    return names;
                };
                // todo: look at renaming the parameters here
                /**
                 * Helper to map a module/singleton arguments if an array was provided
                 * @param {Function} methodArgument - the function to extract metadata from
                 * @returns {MethodInfo} extracted metadata for the given function
                 */
                Utils.extractMethodInformation = function (methodArgument) {
                    var argumentArray; // UNDEFINED if the module is not an ARRAY
                    var moduleFn = methodArgument; // Last element in the array (i.e. Angular style)
                    if (methodArgument instanceof Array) {
                        moduleFn = methodArgument.pop();
                        argumentArray = methodArgument;
                    }
                    return new Dingu.MethodInfo(moduleFn, argumentArray);
                };
                Utils.FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
                Utils.STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
                return Utils;
            }());
            Dingu.Utils = Utils;
        })(Dingu = Utils_1.Dingu || (Utils_1.Dingu = {}));
    })(Utils = Rn.Utils || (Rn.Utils = {}));
})(Rn || (Rn = {}));
//# sourceMappingURL=dingu.js.map