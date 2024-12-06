import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/public/user.module';
import { ConfigModule, ConfigService } from './config';
import { join } from 'node:path';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    AuthModule,
    UserModule,
    ConfigModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get('APP_FALLBACK_LANGUAGE'),
        loaderOptions: { path: join(__dirname, '/il18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService) => {
            return [configService.get('APP_HEADER_LANGUAGE')];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

//MVC - Model View Controller
