import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  private readonly client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async verifyGoogleToken(idToken: string): Promise<any> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const user = this.validateUser(payload.email);
    return user;
  }
  async validateUser(email) {
    let user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: email,
        },
      });
    }
    return user || null;
  }
  async findUser(id: string) {
    return await this.prisma.user.findFirst({
      where: { id },
    });
  }
}
