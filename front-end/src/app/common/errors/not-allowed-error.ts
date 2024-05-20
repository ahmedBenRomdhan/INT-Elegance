export class NotAllowedError {
    public static message: string;

    constructor(error?: any) {
        NotAllowedError.message = error.message;
    }
}
