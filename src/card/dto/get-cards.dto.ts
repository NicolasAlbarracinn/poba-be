import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetCardsDto {
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  type: string;

  @IsString()
  expansion: string;

  @IsOptional()
  @IsString()
  cardId: string | null;
}
