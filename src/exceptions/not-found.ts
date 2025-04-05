import { ErrorCode, HttpExceptions } from "./root";

export class NotFoundException extends HttpExceptions {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 404, null)
  }
}