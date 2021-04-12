export class FilterChangeEvent extends Event {
    constructor(type, filter) {
        super(type);
        this.filter = filter;
    }
}
