import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundError } from '../../common/errors';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(dto: { name?: string; page?: number; limit?: number }) {
    const { name, page = 1, limit = 15 } = dto;
    return this.prismaService.user.findMany({
      ...(name && {
        where: {
          name: {
            contains: name,
          },
        },
      }),
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });
    if (!user) {
      throw new NotFoundError('User', email, 'email');
    }
    return user;
  }
}
