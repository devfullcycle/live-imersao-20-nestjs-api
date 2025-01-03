import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { RegisterDto } from '../../auth/dtos/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoles } from '../../auth/roles/roles';
import { Roles } from '../../auth/roles/roles.decorator';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles/roles.guard';

@Roles(UserRoles.Admin)
@UseGuards(AuthGuard, RolesGuard)
@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Post()
  create(@Body() registerDto: RegisterDto) {
    return this.adminUserService.create(registerDto);
  }

  @Get()
  findAll() {
    return this.adminUserService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.adminUserService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminUserService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.adminUserService.remove(id);
  }
}
