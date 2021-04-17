export class FilterChangeEvent extends Event {
    constructor(type, filters) {
        super(type);
        this.filters = filters;
    }
}
