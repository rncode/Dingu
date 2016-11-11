namespace Rn.Utils.Dingu {
    export class MethodInfo {
        public Fn: Function;
        public Args: string[];

        public constructor(fn: Function, args: string[]) {
            this.Fn = fn;
            this.Args = args;
        }
    }
}