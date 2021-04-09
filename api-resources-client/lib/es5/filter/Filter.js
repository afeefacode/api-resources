export class Filter {
    createActionFilter(json) {
        const filter = new this.constructor();
        filter.setupParams(json);
        return filter;
    }
    setupParams(_json) {
        // do something particular to the actual filter
    }
}
