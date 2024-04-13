import { IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  nickname: string;

  @IsString()
  password: string;
}
