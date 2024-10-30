import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import FailResponse from 'src/common/api-response/fail.response';

export class TokenNotValidException extends HttpException {
  constructor(userId: number) {
    super(`Token not Valid by Id : ${userId}`, HttpStatus.FORBIDDEN);
  }
}

@Catch(TokenNotValidException)
export class TokenNotValidFilter
  implements ExceptionFilter<TokenNotValidException>
{
  catch(exception: TokenNotValidException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();

    console.log(response, request, statusCode);

    response.status(statusCode).json(
      FailResponse.of(
        statusCode, //
        exception.message,
        request.url,
      ),
    );
  }
}
