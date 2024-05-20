
export class AppError {


  public static exemple: string;
  constructor(error?: any) {
    AppError.exemple = error.message;
    console.error(error);
 }


}
