import { IsNotEmpty, IsOptional } from "class-validator";

export class AddPreferenceDto {
  @IsNotEmpty()
  @IsOptional()
  readonly type?: string;

  @IsNotEmpty()
  @IsOptional()
  readonly status?: boolean;
}
