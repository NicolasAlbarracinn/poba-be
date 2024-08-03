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
    const { page, amount, type, expansion } = dto;
    const skip = (page - 1) * amount;
    const take = amount;
    const query = {};
  
    if (type) {
      query['type'] = type;
    }
    if (expansion) {
      query['expansion'] = expansion;
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
    return expansions.map(card => card.expansion);
  }

  async createCard(dto: CreateCardDto, userId: string) {
    try {
      const card = await this.prisma.card.create({
        data: {
          cardCode: dto.cardCode,
          expansion: dto.expansion,
          name: dto.name,
          image: dto.image,
          hp: dto.hp,
          attack: dto.attack,
          type: dto.type,
          resist: dto.resist,
          weak: dto.weak,
          userId: userId
        },
      });
  
      return card;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        // P2002 is the error code for unique constraint violations
        throw new HttpException('Card with this cardCode already exists', HttpStatus.CONFLICT);
      } else {
        throw new HttpException(`Failed to create card: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async updateCard(id: string, dto: UpdateCardDto, userId: string) {
    try {
      const updatedCard = await this.prisma.card.update({
        where: { id },
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
}