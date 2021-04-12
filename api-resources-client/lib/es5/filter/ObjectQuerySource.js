import { BaseQuerySource } from './BaseQuerySource';
export class ObjectQuerySource extends BaseQuerySource {
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
