import { Injectable } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { InvalidCredentialsError } from './errors';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';
import { User } from '@prisma/client';
import { NotFoundError } from '../common/errors';
import { ConfigService } from '../config';
import { AdminUserService } from '../user/admin/admin-user.service';
import { UserService } from '../user/public/user.service';
import { MailService } from '../mail/mail.service';
import ms from 'src/utils/transformers/string-to-ms';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private adminUserService: AdminUserService,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user || !bcrypt.compareSync(dto.password, user.password)) {
      throw new InvalidCredentialsError();
    }

    const payload = {
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<User> {
    return await this.adminUserService.create(registerDto);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new NotFoundError('User', email, 'email');
    }

    const tokenExpiresIn = this.configService.get(
      'AUTH_FORGOT_TOKEN_EXPIRES_IN',
    );

    console.log(tokenExpiresIn, ms('30m'));

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const hash = await this.jwtService.signAsync(
      {
        forgotUserId: user.id,
      },
      {
        secret: this.configService.get('AUTH_FORGOT_SECRET'),
        expiresIn: tokenExpiresIn,
      },
    );

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash,
        tokenExpires,
      },
    });
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        forgotUserId: User['id'];
      }>(hash, {
        secret: this.configService.get('AUTH_FORGOT_SECRET'),
      });

      userId = jwtData.forgotUserId;
    } catch {
      throw new InvalidCredentialsError();
    }

    const user = await this.adminUserService.findOne(userId);

    if (!user) {
      throw new NotFoundError('User', userId);
    }

    const newPass = {
      password: await bcrypt.hash(password, 10),
    };

    await this.adminUserService.update(user.id, newPass);
  }
}
