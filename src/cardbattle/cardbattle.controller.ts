import { Body, Controller, Post, Req } from '@nestjs/common';
import { CardBattleService } from './cardbattle.service';
import { CardBattleDto } from './dto/card-battle.dto';

@Controller('card-battle')
export class CardBattleController {
  constructor(private readonly cardBattlesService: CardBattleService) {}

  @Post()
  async createBattle(@Body() dto: CardBattleDto, @Req() req: any) {
    const userId = req.session.user.id;
    return this.cardBattlesService.createBattle(dto, userId);
  }
}
