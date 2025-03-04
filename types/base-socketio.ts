export interface BaseSocketIOInterface<T> {
  error: boolean;
  code: 400 | 500;
  message: string;
  data: T;
}
