import { IsString } from 'class-validator';

export class SearchCardsDto {
  @IsString()
  term: string;
}