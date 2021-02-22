import { __read, __values } from "tslib";
var Client = /** @class */ (function () {
    function Client() {
    }
    Client.prototype.get = function () {
        var e_1, _a;
        var digits = new Map([
            [0, "zero"],
            [1, "one"],
            [2, "two"],
            [3, "three"],
            [4, "four"],
            [5, "five"],
            [6, "six"],
            [7, "seven"],
            [8, "eight"],
            [9, "nine"]
        ]);
        try {
            for (var digits_1 = __values(digits), digits_1_1 = digits_1.next(); !digits_1_1.done; digits_1_1 = digits_1.next()) {
                var _b = __read(digits_1_1.value, 2), digit = _b[0], name_1 = _b[1];
                console.log(digit + " -> " + name_1);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (digits_1_1 && !digits_1_1.done && (_a = digits_1.return)) _a.call(digits_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return 'GET GET';
    };
    return Client;
}());
export { Client };
