namespace Rn.Utils.Dingu {
    export class CircularDependencyError {
        public RootItem: RegistryItem;
        public DependencyChain: string[];
        public message: string;
        public name: string;

        /**
         * Thrown when a circular dependency is encountered.
         * @constructor
         * @param {RegistryItem} rootItem - the first item that kicked off the resolution
         * @param {string[]} dependencyChain - ordered chain of dependencies that have already been resolved
         */
        public constructor(rootItem: RegistryItem, dependencyChain: string[]) {
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

        public toString() {
            return this.message;
        }
    }
}