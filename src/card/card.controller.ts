import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
  Req,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { CardService } from './card.service';
import { GetCardsDto } from './dto/get-cards.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { SearchCardsDto } from './dto/card-search-options.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  getCards(
    @Query('page', ParseIntPipe) page: number,
    @Query('amount', ParseIntPipe) amount: number,
    @Query('type') type: string,
    @Query('expansion') expansion: string,
  ) {
    const dto = new GetCardsDto();
    dto.page = page;
    dto.amount = amount;
    dto.type = type;
    dto.expansion = expansion;
    return this.cardService.getCards(dto);
  }

  @Get('expansions')
  getUniqueExpansions() {
    return this.cardService.getUniqueExpansions();
  }

  @Post('create')
  createCard(@Body() dto: CreateCardDto, @Req() req: any) {
    const userId = req.session.user.id; // Access user ID from session
    return this.cardService.createCard(dto, userId);
  }

  @Patch(':id')
  async updateCard(
    @Param('id', ParseIntPipe) id: string,
    @Body() dto: UpdateCardDto,
    @Req() req: any,
  ) {
    const userId = req.session.userId; // Access user ID from session
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.cardService.updateCard(id, dto, userId);
  }

  @Delete(':id')
  async deleteCard(@Param('id', ParseIntPipe) id: string) {
    return this.cardService.deleteCard(id);
  }
  @Get('search-options')
  async search(@Query('term') term: string) {
    const dto = new SearchCardsDto();
    dto.term = term;
    return this.cardService.getSearchOptions(dto);
  }
}
