export interface ResendResponse {
  message: string;
  statusCode: number;
}

export interface ResendRequestBody {
  receiver: string;
  subject: string;
  message: string;
  retry: number;
}
