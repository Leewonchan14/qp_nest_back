export default class SuccessResponse<T> {
  isSuccess: boolean = true;
  message: string = 'ok';
  timestamp: string = new Date().toISOString();

  constructor(
    private status: number,
    private result: T,
    private path?: string,
  ) {}

  static of(status: number, result: any, path?: string) {
    return new SuccessResponse(status, result, path);
  }
}
