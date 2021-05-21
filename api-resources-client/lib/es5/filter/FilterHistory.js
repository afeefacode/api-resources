class FilterHistory {
    constructor() {
        this.filters = {};
        this.validFilters = {};
    }
    createRequestFilters(listId, action, querySource) {
        if (!this.filters[listId] || this.validFilters[listId] === false) {
            this.filters[listId] = action.createRequestFilters(querySource);
        }
        return this.filters[listId];
    }
    markFiltersValid(listId, valid) {
        this.validFilters[listId] = valid;
    }
}
export const filterHistory = new FilterHistory();
