export declare type RelatedTypeJSON = {
    type?: string;
    types?: string[];
    link?: boolean;
    list?: boolean;
};
export declare class RelatedType {
    types: string[];
    isList: boolean;
    isLink: boolean;
    constructor(json: RelatedTypeJSON);
}
//# sourceMappingURL=RelatedType.d.ts.map