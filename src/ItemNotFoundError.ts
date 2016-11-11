namespace Rn.Utils.Dingu {
    export class ItemNotFoundError {
        public Item: string;
        public message: string;

        /**
         * Thrown when an item isn't present in the registry
         * @constructor
         * @param {string} item - the item name
         */
        public constructor(item: string) {
            this.Item = item;
            this.message = 'Item not found: ' + item + ' - was it registered?';
        }

        public toString() {
            return this.message;
        }
    }
}