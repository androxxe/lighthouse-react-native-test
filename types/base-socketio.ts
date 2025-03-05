export interface BaseSocketIOInterface<T> {
  error: boolean;
  code: 200 | 400 | 500;
  message: string;
  data: T;
}
