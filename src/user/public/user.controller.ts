import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserQueryDto } from './dto/user-query.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() queryDto: UserQueryDto) {
    return this.userService.findAll(queryDto);
  }

  @Get(':email')
  async findOne(@Param('email') email: string) {
    return await this.userService.findOne(email);
  }
}
