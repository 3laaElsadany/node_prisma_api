import { HttpExceptions } from "./root";

export class UnprocessableEntity extends HttpExceptions {
  constructor(error: any, message: string, errorCode: number) {
    super(message, errorCode, 422, error);
  }
}