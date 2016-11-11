namespace Rn.Utils.Dingu {
    export class RegistryItem {
        public Name: string;
        public Target: Function;
        public Type: RegistryItemType;
        public Value: any;
        public DependencyNames: string[];

        /**
         * @constructor
         * @param {string} name - the name of this item
         * @param {Function} target - the target function
         * @param {RegistryItemType} registryItemType - the type of item being registered
         * @param {string[]} argumentsArray - arguments for this item
        */
        public constructor(name: string, target: Function, registryItemType: RegistryItemType, argumentsArray: string[] = null) {
            this.Name = name;
            this.Target = target;
            this.Type = registryItemType;

            this.Value = registryItemType === RegistryItemType.VALUE ?
                target :
                null;

            this.DependencyNames = registryItemType !== RegistryItemType.VALUE ?
                Utils.getFunctionArguments(target, argumentsArray) :
                null;
        }
    }
}