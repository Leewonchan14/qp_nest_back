type FALSY = Promise<any> | undefined | null | void;

type NotFALSY<T> = T extends FALSY ? never : T;

export default class SuccessResponse<T> {
  isSuccess: boolean = true;
  message: string = 'ok';
  timestamp: string = new Date().toISOString();

  constructor(
    private readonly status: number,
    private readonly result: T,
    private readonly path?: string,
  ) {}

  static of<D>(status: number, result: NotFALSY<D>, path?: string) {
    return new SuccessResponse(status, result, path);
  }
}
