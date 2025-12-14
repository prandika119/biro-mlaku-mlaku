import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Request, Response } from 'express';
import { UserResponse } from 'src/model/user.model';

export interface AuthenticatedRequest extends Request {
  user: UserResponse;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(
    req: AuthenticatedRequest,
    res: Response,
    next: (error?: any) => void,
  ) {
    const token = req.headers['authorization'];
    if (token) {
      const user = await this.prismaService.user.findFirst({
        where: {
          token: token,
        },
      });

      if (user) {
        req.user = user;
      }
    }
    next();
  }
}
