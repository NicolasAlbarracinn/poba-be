import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { GetCardsDto } from './dto/get-cards.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SearchCardsDto } from './dto/card-search-options.dto';

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}

  async getCards(dto: GetCardsDto) {
    const { page, amount, type, expansion, cardId } = dto;
    const skip = (page - 1) * amount;
    const take = amount;
    const query = {};

    if (type) {
      query['type'] = type;
    }
    if (expansion) {
      query['expansion'] = expansion;
    }
    if (cardId) {
      query['id'] = cardId;
    }

    const [cards, total] = await this.prisma.$transaction([
      this.prisma.card.findMany({
        where: query,
        skip,
        take,
      }),
      this.prisma.card.count(),
    ]);

    return {
      cards,
      total,
    };
  }

  async getUniqueExpansions(): Promise<string[]> {
    const expansions = await this.prisma.card.findMany({
      distinct: ['expansion'],
      select: {
        expansion: true,
      },
    });

    // Map the results to extract only the expansion names
    return expansions.map((card) => card.expansion);
  }

  async createCard(dto: CreateCardDto, userId: string) {
    const data = {
      cardCode: dto.cardCode,
      expansion: dto.expansion,
      name: dto.name,
      image: dto.image,
      hp: dto.hp,
      attack: dto.attack,
      type: dto.type,
      resist: dto.resist,
      weak: dto.weak,
      userId: userId,
    };
    console.log(data);
    try {
      const card = await this.prisma.card.create({data});

      return card;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // P2002 is the error code for unique constraint violations
        throw new HttpException(
          'Card with this cardCode already exists',
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          `Failed to create card: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateCard(dto: UpdateCardDto, userId: string) {
    console.log(dto);
    try {
      const updatedCard = await this.prisma.card.update({
        where: { id: dto.id },
        data: {
          ...dto,
          updatedBy: userId,
        },
      });

      return updatedCard;
    } catch (error) {
      throw new Error(`Failed to update card: ${error.message}`);
    }
  }
  async deleteCard(id: string) {
    try {
      const deletedCard = await this.prisma.card.delete({
        where: { id },
      });

      return deletedCard;
    } catch (error) {
      throw new Error(`Failed to delete card: ${error.message}`);
    }
  }
  async getSearchOptions(dto: SearchCardsDto) {
    const { term } = dto;

    const cards = await this.prisma.card.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { cardCode: { contains: term, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        cardCode: true,
      },
    });

    return cards;
  }
  async getCardById(id: string) {
    try {
      const card = await this.prisma.card.findUnique({
        where: { id },
      });

      if (!card) {
        throw new HttpException('Card not found', HttpStatus.NOT_FOUND);
      }

      return card;
    } catch (error) {
      throw new Error(`Failed to get card: ${error.message}`);
    }
  }
}
