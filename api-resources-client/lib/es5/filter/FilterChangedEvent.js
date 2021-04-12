export class FilterChangedEvent extends Event {
    constructor(type, filter) {
        super(type);
        this.filter = filter;
    }
}
