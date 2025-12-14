export class WebResponse<T> {
  success: boolean;
  data: T;
  errors: string[];
}
