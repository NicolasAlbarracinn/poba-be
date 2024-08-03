import { Module } from '@nestjs/common';
import { CardModule } from './card/card.module';
import { CardBattleModule } from './cardbattle/cardbattle.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    PassportModule.register({ session: true}),
    CardModule,
    CardBattleModule
  ],
})
export class AppModule {}
