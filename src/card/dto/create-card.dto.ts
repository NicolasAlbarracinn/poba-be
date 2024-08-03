import { IsInt, IsNotEmpty, IsString, IsUrl, Min } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  cardCode: string;

  @IsString()
  @IsNotEmpty()
  expansion: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsInt()
  @Min(0)
  hp: number;

  @IsInt()
  @Min(0)
  attack: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  resist: string;

  @IsString()
  weak: string;
}
