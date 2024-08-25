export interface Record {
  id: number;
  name: string;
  receiver: string;
  from: string;
  subject: string;
  message: string;
  retry: number;
  sentTime: Date;
  status: number;
  isAttempting: boolean;
}
