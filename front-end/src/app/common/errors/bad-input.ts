export class BadInput {
  public static exemple: string;
  public static message: string;
  public static errer: string;
  public static errerMessage: string;
  constructor(error?: any) {
    BadInput.message = error.message;
    BadInput.exemple = error.message;
    BadInput.errer = error.errors[0].msg;
    BadInput.errerMessage = error;
  }

}
