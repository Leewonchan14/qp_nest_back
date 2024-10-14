export default class FailResponse {
  isSuccess: boolean = false;
  timestamp: string = new Date().toISOString();

  constructor(
    private status: number,
    private message: string,
    private path?: string,
  ) {}

  static of(status: number, message: string, path?: string) {
    return new FailResponse(status, message, path);
  }
}
