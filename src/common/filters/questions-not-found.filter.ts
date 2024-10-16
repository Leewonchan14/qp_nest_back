import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import FailResponse from 'src/common/api-response/fail.response';

export class QuestionsNotFoundException extends HttpException {
  constructor(questionId: number) {
    super(`Question NotFound by Id : ${questionId}`, HttpStatus.NOT_FOUND);
  }
}

@Catch(QuestionsNotFoundException)
export class UserNotFoundExceptionFilter
  implements ExceptionFilter<QuestionsNotFoundException>
{
  catch(exception: QuestionsNotFoundException, host: ArgumentsHost) {
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
