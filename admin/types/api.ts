export interface IPagination {
  page: number;
  limit: number;
  pages: number;
  total: number;
}

export interface IResponse<T = unknown> {
  __typename?: string;
  message: string;
  data?: T;
  pagination?: IPagination;
  url?: string;
  code?: string;
  status?: number;
}

export class APIError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "APIError";
    this.code = code;
    this.status = status;
  }
}

export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}
