import { Body, Controller, Post, Req } from '@nestjs/common';
import { CardBattleService } from './cardbattle.service';
import { CardBattleDto } from './dto/card-battle.dto';

@Controller('cardbattle')
export class CardBattleController {
  constructor(private readonly cardBattlesService: CardBattleService) {}

  @Post('battle')
  async createBattle(
    @Body() dto: CardBattleDto,
    @Req() req: any
  ) {
    const userId = req.session.userId;
    return this.cardBattlesService.initiateBattle(dto, userId);
  }
}