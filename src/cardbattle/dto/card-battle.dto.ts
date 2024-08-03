import { IsInt, IsNotEmpty } from 'class-validator';

export class CardBattleDto {
  @IsInt()
  @IsNotEmpty()
  cardChosenId: string;

  @IsInt()
  @IsNotEmpty()
  cardAgainstId: string;
}