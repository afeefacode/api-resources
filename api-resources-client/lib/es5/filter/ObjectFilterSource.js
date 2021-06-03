import { BaseFilterSource } from './BaseFilterSource';
export class ObjectFilterSource extends BaseFilterSource {
    constructor(query) {
        super();
        this.query = {};
        this.query = query;
    }
    getQuery() {
        return this.query;
    }
    push(query) {
        this.query = Object.assign({}, query);
    }
}
