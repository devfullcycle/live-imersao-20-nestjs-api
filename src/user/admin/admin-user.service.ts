import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from '../../auth/dtos/register.dto';
import { UserEmailAlreadyExistsError } from '../errors';
import { NotFoundError } from '../../common/errors';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoles } from '../../auth/roles/roles';

@Injectable()
export class AdminUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: RegisterDto) {
    if (await this.findByEmail(createUserDto.email)) {
      throw new UserEmailAlreadyExistsError(createUserDto.email);
    }

    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      role: UserRoles.Customer,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    return await this.prismaService.user.create({ data });
  }

  findByEmail(email: string) {
    return this.prismaService.user.findFirst({ where: { email } });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: string) {
    const response = await this.prismaService.user.findFirst({
      where: { id },
    });

    if (!response) {
      throw new NotFoundError('User', id);
    }

    return response;
  }

  async update(id: string, updateUserDto: Partial<UpdateUserDto>) {
    let user = null;
    if (updateUserDto.email) {
      user = await this.prismaService.user.findFirst({
        where: {
          email: updateUserDto.email,
        },
      });
    }

    if (user && user.id !== id) {
      throw new UserEmailAlreadyExistsError(updateUserDto.email);
    }

    user =
      user && user.id === id
        ? user
        : await this.prismaService.user.findFirst({ where: { id } });

    if (!user) {
      throw new NotFoundError('User', id);
    }

    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    const response = await this.prismaService.user.findFirst({
      where: { id },
    });

    if (!response) {
      throw new NotFoundError('User', id);
    }

    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
