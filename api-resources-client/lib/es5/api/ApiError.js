export class ApiError {
    constructor(request, error) {
        this.request = request;
        this.error = error;
        this.message = this.getErrorDescription();
    }
    getErrorDescription() {
        if (this.error.response) {
            const data = this.error.response.data;
            if (data.message) {
                return data.message;
            }
        }
        return 'Es ist ein Fehler aufgetreten';
    }
}
