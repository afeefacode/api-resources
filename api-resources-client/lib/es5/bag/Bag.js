export class Bag {
    constructor() {
        this._entries = {};
    }
    add(name, entry) {
        this._entries[name] = entry;
        return this;
    }
    has(name) {
        return this._entries.hasOwnProperty(name);
    }
    get(name) {
        return this._entries[name] || null;
    }
    entries() {
        return Object.entries(this._entries);
    }
    values() {
        return Object.values(this._entries);
    }
    getEntries() {
        return this._entries;
    }
}
