import { ApiProperty } from '@nestjs/swagger';

export interface PlunkResponse {
  message: string;
  statusCode: number;
}

export class PlunkRequestBody {
  @ApiProperty()
  receiver: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  retry: number;
}
