import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import FailResponse from 'src/common/api-response/fail.response';

export class UserNotFoundException extends HttpException {
  constructor(userId: number) {
    super(`User NotFound by Id : ${userId}`, HttpStatus.NOT_FOUND);
  }
}

@Catch(UserNotFoundException)
export class UserNotFoundExceptionFilter
  implements ExceptionFilter<HttpException>
{
  catch(exception: UserNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();

    // response.status(statusCode).json({
    //   statusCode,
    //   message: exception.message,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    // });

    response.status(statusCode).json(
      FailResponse.of(
        statusCode, //
        exception.message,
        request.url,
      ),
    );
  }
}
