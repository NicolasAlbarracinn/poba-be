import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/login')
  async handleLogin(
    @Query('credential') credential: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.authService.verifyGoogleToken(credential);

    if (user) {
      req.session.user = user;
      req.session.token = credential;
      res.cookie('sessionId', req.sessionID, { httpOnly: true });
      return res.json({ user });
    } else {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  }
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Failed to log out.');
      }
      res.clearCookie('connect.sid');
      res.clearCookie('sessionId');
      return res.status(200).send('Logged out successfully.');
    });
  }
}
