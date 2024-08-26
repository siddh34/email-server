export interface Record {
  receiver: string;
  from: string;
  subject: string;
  message: string;
  retry: number;
  sentTime: Date;
  status: number;
  isAttempting: boolean;
}
