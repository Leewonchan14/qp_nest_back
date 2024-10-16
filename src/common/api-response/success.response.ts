export default class SuccessResponse<T> {
  isSuccess: boolean = true;
  message: string = 'ok';
  timestamp: string = new Date().toISOString();

  constructor(
    private status: number,
    private result: T,
    private path?: string,
  ) {}

  static of<D>(
    status: number,
    result: Exclude<D, Promise<any>>,
    path?: string,
  ): SuccessResponse<D> {
    return new SuccessResponse(status, result, path);
  }
}
