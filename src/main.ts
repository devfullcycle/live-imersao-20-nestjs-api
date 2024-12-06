import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductSlugAlreadyExistsErrorFilter } from './products/filters/product-slug-already-exists.filter';
import { ValidationPipe } from '@nestjs/common';
import { NotFoundErrorFilter } from './common/filters/not-found-error.filter';
import { InvalidCredentialsErrorFilter } from './auth/filters/invalid-credentials-error.filter';
import { UserEmailAlreadyExistsErrorFilter } from './user/filters/product-slug-already-exists.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalFilters(
    new UserEmailAlreadyExistsErrorFilter(),
    new ProductSlugAlreadyExistsErrorFilter(),
    new NotFoundErrorFilter(),
    new InvalidCredentialsErrorFilter(),
  ); //tratamento de erros
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
