export class ApiError {
    constructor(request, error) {
        this.request = request;
        this.error = error;
        this.message = this.getErrorDescription();
        this.detail = this.getErrorDetail();
    }
    getErrorDescription() {
        if (this.error.response) {
            const data = this.error.response.data;
            if (data.message) {
                return data.message;
            }
        }
        if (this.error.message) {
            return this.error.message;
        }
        return null;
    }
    getErrorDetail() {
        if (this.error.response) {
            const data = this.error.response.data;
            if (data.exception && data.exception[0]) {
                return data.exception[0].message;
            }
        }
        return null;
    }
}
