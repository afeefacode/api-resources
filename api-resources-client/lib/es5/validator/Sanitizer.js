export class Sanitizer {
    constructor(name, json) {
        this.name = name;
        this.default = json.default || null;
    }
}
