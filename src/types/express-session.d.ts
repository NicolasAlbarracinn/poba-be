import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
    };
    token: string;
  }
}
