export default class PaginateResponse<T> {
  constructor(
    private readonly data: T,
    private readonly lastPage: number,
    private readonly total: number,
  ) {}

  static of<D>(
    data: D[],
    likesCount: number[],
    lastPage: number,
    total: number,
  ) {
    return new PaginateResponse(data, lastPage, total);
  }

  static toPaginate<F>(data: F, total: number, page: number, pageSize: number) {
    return {
      data,
      total,
      lastPage: Math.max(Math.ceil(total / pageSize) - 1, 0),
    };
  }
}
