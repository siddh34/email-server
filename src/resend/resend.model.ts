import { ApiProperty } from '@nestjs/swagger';

export interface ResendResponse {
  message: string;
  statusCode: number;
}

export class ResendRequestBody {
  @ApiProperty()
  receiver: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  retry: number;
}
