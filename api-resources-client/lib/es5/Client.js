import axios from 'axios';
export class Client {
    get(url) {
        return axios.get(url);
    }
    post(url, params) {
        return axios.post(url, params);
    }
}
