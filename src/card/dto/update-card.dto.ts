import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class UpdateCardDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  cardCode?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  hp?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  attack?: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  resist?: string;

  @IsString()
  @IsOptional()
  weak?: string;
}
