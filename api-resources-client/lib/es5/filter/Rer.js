export class Filter {
    createActionFilter(json) {
        const filter = new this.constructor();
        filter.type = this.type;
        filter.setupParams(json);
        return filter;
    }
    createRequestFilter() {
        const filter = new this.constructor();
        filter.type = this.type;
        filter.cloneParams(this);
        return filter;
    }
    setType(type) {
        this.type = type;
    }
    setupParams(_json) {
        // do something particular to the actual filter
    }
    cloneParams(_filter) {
        // do something particular to the actual filter
    }
}
