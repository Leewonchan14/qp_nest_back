import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    //log url, method, status code, time
    const url = context.switchToHttp().getRequest().url;
    const method = context.switchToHttp().getRequest().method;
    const now = Date.now();
    context
      .switchToHttp()
      .getResponse()
      .on('finish', () => {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        console.log(`${method} ${url} ${statusCode} ${Date.now() - now}ms`);
      });

    // get accesstoken
    return super.canActivate(context);
  }
}
