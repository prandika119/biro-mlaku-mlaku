import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { AuthenticatedRequest } from './auth.middleware';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>()?.user;
    if (!user) {
      throw new HttpException('Unauthorized', 401);
    }
    return !!user;
  }
}
