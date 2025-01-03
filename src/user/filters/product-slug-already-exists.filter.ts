import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { UserEmailAlreadyExistsError } from '../errors';

@Catch(UserEmailAlreadyExistsError)
export class UserEmailAlreadyExistsErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(409).json({
      statusCode: 409,
      message: exception.message,
    });
  }
}
