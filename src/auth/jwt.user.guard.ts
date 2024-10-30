import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JwtUserGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
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

    const request = context.switchToHttp().getRequest();
    const { userId } = request.user;
    const params = request.params;
    return userId === +params.userId;
  }
}
