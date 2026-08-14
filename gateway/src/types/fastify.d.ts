import 'fastify';
import { User } from '@prisma/client';

declare module 'fastify' {
  interface FastifyRequest {
    userId: string;
    user: User;
    cookies: {
        [cookieName: string]: string | undefined;
    };
  }
}
