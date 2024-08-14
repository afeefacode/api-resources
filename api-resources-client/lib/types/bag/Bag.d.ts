export type BagEntries<T> = Record<string, T>;
export declare class Bag<T> {
    private _entries;
    add(name: string, entry: T): Bag<T>;
    has(name: string): boolean;
    get(name: string): T | null;
    entries(): [string, T][];
    values(): T[];
    getEntries(): BagEntries<T>;
}
//# sourceMappingURL=Bag.d.ts.map