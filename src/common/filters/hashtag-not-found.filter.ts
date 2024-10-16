import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import FailResponse from 'src/common/api-response/fail.response';

export class HashTagsNotFoundException extends HttpException {
  constructor(hashTagIds: number[]) {
    super(`HashTag NotFound by Id in : ${hashTagIds}`, HttpStatus.NOT_FOUND);
  }
}

@Catch(HashTagsNotFoundException)
export class UserNotFoundExceptionFilter
  implements ExceptionFilter<HashTagsNotFoundException>
{
  catch(exception: HashTagsNotFoundException, host: ArgumentsHost) {
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
