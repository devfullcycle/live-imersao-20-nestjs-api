import { Module } from '@nestjs/common';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigModule } from '../../config';
import { UserService } from '../public/user.service';
import { UserModule } from '../public/user.module';

@Module({
  imports: [PrismaModule, ConfigModule, UserModule],
  controllers: [AdminUserController],
  providers: [AdminUserService, UserService],
  exports: [AdminUserService],
})
export class AdminUserModule {}
