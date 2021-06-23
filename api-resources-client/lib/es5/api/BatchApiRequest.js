import { ApiRequest } from './ApiRequest';
export class BatchApiRequest extends ApiRequest {
    send() {
        if (this.currentPromise) {
            return this.currentPromise;
        }
        this.currentPromise = new Promise(resolve => {
            setTimeout(() => {
                this.currentPromise = undefined;
                resolve(super.send());
            }, 50);
        });
        return this.currentPromise;
    }
}
