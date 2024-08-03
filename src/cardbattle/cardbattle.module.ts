import { Module } from '@nestjs/common';
import { CardBattleService } from './cardbattle.service';
import { CardBattleController } from './cardbattle.controller';

@Module({
  providers: [CardBattleService],
  controllers: [CardBattleController],
})
export class CardBattleModule {}