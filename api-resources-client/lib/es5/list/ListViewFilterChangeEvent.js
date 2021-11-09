export class ListViewFilterChangeEvent extends Event {
    constructor(type, filters) {
        super(type);
        this.filters = filters;
    }
}
