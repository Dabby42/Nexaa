import { IsArray, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class MagentoOrderDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  affiliate: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  status: string;

  @IsArray()
  orderItems: OrderItemsDto[];
}

class OrderItemsDto {
  @IsNotEmpty()
  @IsNumberString()
  sku: string;

  @IsNumber()
  qty: number;

  @IsString()
  name: string;

  @IsNumberString()
  price: string;

  @IsArray()
  categoryIds: string[];
}
