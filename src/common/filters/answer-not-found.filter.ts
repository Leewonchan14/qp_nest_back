import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import FailResponse from 'src/common/api-response/fail.response';

export class AnswersNotFoundException extends HttpException {
  constructor(answerId: number) {
    super(`Answer NotFound by Id : ${answerId}`, HttpStatus.NOT_FOUND);
  }
}

@Catch(AnswersNotFoundException)
export class AnswersNotFoundExceptionFilter
  implements ExceptionFilter<AnswersNotFoundException>
{
  catch(exception: AnswersNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();

    response.status(statusCode).json(
      FailResponse.of(
        statusCode, //
        exception.message,
        request.url,
      ),
    );
  }
}
