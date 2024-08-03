import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CardBattleDto } from './dto/card-battle.dto';

@Injectable()
export class CardBattleService {
  constructor(private readonly prisma: PrismaService) {}

  async initiateBattle(dto: CardBattleDto, userId: string) {
    const { cardChosenId, cardAgainstId } = dto;

    const [chosenCard, againstCard] = await this.prisma.$transaction([
      this.prisma.card.findUnique({ where: { id: cardChosenId } }),
      this.prisma.card.findUnique({ where: { id: cardAgainstId } }),
    ]);

    if (!chosenCard || !againstCard) {
      throw new Error('One or both cards not found.');
    }

    const result = this.calculateBattleResult(chosenCard, againstCard);

    // Save the battle result
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
    // Simple example: Attack vs. HP
    let result = chosenCard.attack > againstCard.hp;

    // Check for weaknesses and resistances
    if (chosenCard.weak === againstCard.type) {
      result = false; // Chosen card is weak against the opponent's type
    } else if (chosenCard.resist === againstCard.type) {
      result = true; // Chosen card is resistant to the opponent's type
    }

    return result;
  }
}