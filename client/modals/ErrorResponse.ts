interface ErrorDetail {
  message: string;
  field?: string;
}

interface ErrorResponse {
  error: ErrorDetail[];
}

export type { ErrorResponse, ErrorDetail };
