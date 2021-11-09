import { ListViewFilterSource } from './ListViewFilterSource';
export class ObjectFilterSource extends ListViewFilterSource {
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
