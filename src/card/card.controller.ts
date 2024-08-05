import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Put,
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
    @Query('cardId') cardId: string,
  ) {
    const dto = new GetCardsDto();
    dto.page = page;
    dto.amount = amount;
    dto.type = type;
    dto.expansion = expansion;
    dto.cardId = cardId;
    return this.cardService.getCards(dto);
  }

  @Get('expansions')
  getUniqueExpansions() {
    return this.cardService.getUniqueExpansions();
  }

  @Post('create')
  createCard(@Body() dto: CreateCardDto, @Req() req: any) {
    const userId = req.session.user.id;
    return this.cardService.createCard(dto, userId);
  }

  @Patch()
  async updateCard(@Body() dto: UpdateCardDto, @Req() req: any) {
    console.log('acaa', req.session);
    const userId = req.session.user.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.cardService.updateCard(dto, userId);
  }

  @Delete(':id')
  async deleteCard(@Param('id') id: string) {
    return this.cardService.deleteCard(id);
  }
  @Get('search-options')
  async search(@Query('term') term: string) {
    const dto = new SearchCardsDto();
    dto.term = term;
    return this.cardService.getSearchOptions(dto);
  }
  @Get(':id')
  async getCardById(@Param('id') id: string) {
    const card = await this.cardService.getCardById(id);
    return card;
  }
}
