export class ApiError {
    constructor(request, error) {
        this.request = request;
        this.error = error;
        this.message = this.getErrorMessage();
        this.detail = this.getErrorDetail();
    }
    getErrorMessage() {
        // error message from server
        if (this.error.response) {
            const data = this.error.response.data;
            if (data.message) {
                return data.message;
            }
        }
        // else if error has a message field
        if (this.error.message) {
            return this.error.message;
        }
        return null;
    }
    getErrorDetail() {
        // error message from server
        if (this.error.response) {
            const data = this.error.response.data;
            if (data.error_details) {
                return data.error_details;
            }
        }
        return null;
    }
}
