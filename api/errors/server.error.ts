export class ServerError extends Error {
    code: any;

    constructor (code, message) {
        super(message);
        this.code = code;
    }
}
