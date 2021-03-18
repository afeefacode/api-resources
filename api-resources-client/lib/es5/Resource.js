import axios from "axios";
export class Resource {
    constructor(type) {
        this.type = null;
        this.proxy = null;
        this.type = type;
        this.proxy = new Proxy(this, {
            get: (resource, key) => {
                return resource[key];
            }
        });
        return this.proxy;
    }
    list() {
        return axios.post('/api/frontend', {
            resource: this.type
        });
    }
}
