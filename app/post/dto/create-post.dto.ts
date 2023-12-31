import { IsNotEmpty } from "class-validator";

export class CreatePostDto {
  @IsNotEmpty()
  readonly body: string;

  @IsNotEmpty()
  readonly publication_time: string;
}
