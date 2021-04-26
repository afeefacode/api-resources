import { Model } from '../Model';
export class ApiResponse {
    constructor(request, response) {
        this.data = null;
        this.request = request;
        const dataJSON = response.data.data;
        if (Array.isArray(dataJSON)) {
            const models = [];
            dataJSON.forEach(json => {
                models.push(this.toModel(json));
            });
            this.data = models;
        }
        else if (dataJSON) {
            this.data = this.toModel(dataJSON);
        }
        this.meta = response.data.meta;
    }
    toModel(json) {
        return Model.create(json);
    }
}
