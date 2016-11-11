namespace Rn.Utils.Dingu {
    export class Utils {
        public static FN_ARGS: RegExp = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        public static STRIP_COMMENTS: RegExp = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

        /**
         * @param {Function} target - the target function
         * @param {string[]} argumentsArray - 
         * @returns {string[]} array of all arguments required by the target function
         */
        public static getFunctionArguments(target: Function, argumentsArray: string[]): string[] {
            var args: string[] = [];
            var names: string[] = [];

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
        }

        // todo: look at renaming the parameters here
        /**
         * Helper to map a module/singleton arguments if an array was provided
         * @param {Function} methodArgument - the function to extract metadata from
         * @returns {MethodInfo} extracted metadata for the given function
         */
        public static extractMethodInformation(methodArgument: Function): MethodInfo {
            var argumentArray; // UNDEFINED if the module is not an ARRAY
            var moduleFn = methodArgument; // Last element in the array (i.e. Angular style)

            if (methodArgument instanceof Array) {
                moduleFn = methodArgument.pop();
                argumentArray = methodArgument;
            }

            return new MethodInfo(moduleFn, argumentArray);
        }
    }
}