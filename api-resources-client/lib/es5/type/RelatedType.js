export class RelatedType {
    constructor(json) {
        this.types = [];
        this.isList = false;
        this.isLink = false;
        if (json.type) {
            this.types = [json.type];
        }
        else {
            this.types = json.types;
        }
        this.isLink = json.link || false;
        this.isList = json.list || false;
    }
}
