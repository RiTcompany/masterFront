declare module 'nprogress' {
    function start(): void;
    function done(): void;
    function set(n: number): void;
    function inc(n?: number): void;
    function configure(options: object): void;

    export { start, done, set, inc, configure };
}