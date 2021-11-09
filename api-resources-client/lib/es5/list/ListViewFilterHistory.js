class ListViewFilterHistory {
    constructor() {
        this.filters = {};
    }
    hasFilters(historyKey) {
        return !!this.filters[historyKey];
    }
    getFilters(historyKey) {
        return this.filters[historyKey];
    }
    setFilters(historyKey, filters) {
        this.filters[historyKey] = filters;
    }
    removeFilters(historyKey) {
        delete this.filters[historyKey];
    }
}
export const filterHistory = new ListViewFilterHistory();
