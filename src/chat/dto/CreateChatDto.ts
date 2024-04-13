import { IsNumber, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  type: number;

  @IsNumber({}, { each: true })
  users: number[];

  @IsString()
  title: string;
}
