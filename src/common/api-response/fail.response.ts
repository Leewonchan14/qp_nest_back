export default class FailResponse {
  isSuccess: boolean = false;
  timestamp: string = new Date().toISOString();

  constructor(
    private readonly status: number,
    private readonly message: string,
    private readonly path?: string,
  ) {}

  static of(status: number, message: string, path?: string): FailResponse {
    return new FailResponse(status, message, path);
  }
}
