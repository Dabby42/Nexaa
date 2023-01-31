import { IsJWT } from 'class-validator';

export class GoogleLoginDto {
  @IsJWT()
  token : string;
}