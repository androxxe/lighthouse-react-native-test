export interface BaseResponseInterface<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface BaseResponseErrorInterface<T> {
  statusCode: number;
  message: string;
  data: T;
}
