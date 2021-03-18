import axios from "axios";
var Client = /** @class */ (function () {
    function Client() {
    }
    Client.prototype.get = function (url) {
        return axios.get(url);
    };
    return Client;
}());
export { Client };
