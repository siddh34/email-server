export interface PlunkResponse {
  message: string;
  statusCode: number;
}

export interface PlunkRequestBody {
  receiver: string;
  subject: string;
  message: string;
  retry: number;
}
