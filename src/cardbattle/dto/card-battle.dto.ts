import { IsNotEmpty, IsString } from 'class-validator';

export class CardBattleDto {
  @IsString()
  @IsNotEmpty()
  cardChosenId: string;

  @IsString()
  @IsNotEmpty()
  cardAgainstId: string;
}
