import { IsNotEmpty } from "class-validator";

export class GetClickRecordsByDaysDto {
  @IsNotEmpty()
  readonly daysAgo: number;
}
