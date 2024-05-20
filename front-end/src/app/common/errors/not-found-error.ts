export class NotFoundError {
    public static message: string;

    constructor(error?: any) {
        NotFoundError.message = error.message;
    }
}
