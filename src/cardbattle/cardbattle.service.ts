import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CardBattleDto } from './dto/card-battle.dto';

@Injectable()
export class CardBattleService {
  constructor(private readonly prisma: PrismaService) {}

  async createBattle(dto: CardBattleDto, userId: string) {
    const { cardChosenId, cardAgainstId } = dto;

    const [chosenCard, againstCard] = await this.prisma.$transaction([
      this.prisma.card.findUnique({ where: { id: cardChosenId } }),
      this.prisma.card.findUnique({ where: { id: cardAgainstId } }),
    ]);

    if (!chosenCard || !againstCard) {
      throw new Error('One or both cards not found.');
    }

    const result = this.calculateBattleResult(chosenCard, againstCard);

    const battle = await this.prisma.cardBattle.create({
      data: {
        cardChosenId,
        cardAgainstId,
        result,
        userId,
      },
    });

    return battle;
  }

  private calculateBattleResult(chosenCard: any, againstCard: any): boolean {
    let chosenAttack = chosenCard.attack
    if (chosenCard.type === againstCard.weak) {
      chosenAttack = chosenAttack * 2
    }
    if (chosenCard.type === againstCard.resist) {
      chosenAttack = chosenAttack / 2
    }

   const hpResult = againstCard.hp - chosenAttack
   if (hpResult <= 0) {
    return true
   }
   return false
  }
}
