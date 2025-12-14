import {
  Body,
  Post,
  Controller,
  HttpCode,
  Get,
  UseGuards,
  Delete,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
  UserUpdateRequest,
} from '../model/user.model';
import { Auth } from '../common/auth.decorator';
import type { User } from '@prisma/client';
import { RoleGuard } from '../common/role.guard';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(RoleGuard)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const user = await this.userService.register(request);
    return {
      success: true,
      data: user,
      errors: [],
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const user = await this.userService.login(request);
    return {
      success: true,
      data: user,
      errors: [],
    };
  }

  @Get('/profile')
  @HttpCode(200)
  async get(@Auth() user): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.get(user);
    return {
      success: true,
      data: result,
      errors: [],
    };
  }

  @Get()
  @HttpCode(200)
  @UseGuards(RoleGuard)
  async getAll(): Promise<WebResponse<UserResponse[]>> {
    const result = await this.userService.getAll();
    return {
      success: true,
      data: result,
      errors: [],
    };
  }

  @Patch()
  @HttpCode(200)
  @UseGuards(RoleGuard)
  async update(
    @Auth() user: User,
    @Body() request: Partial<UserUpdateRequest>,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.update(user, request);
    return {
      success: true,
      data: result,
      errors: [],
    };
  }

  @Patch('/:id')
  @HttpCode(200)
  @UseGuards(RoleGuard)
  async adminUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: Partial<UserUpdateRequest>,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.adminUpdate(id, request);
    return {
      success: true,
      data: result,
      errors: [],
    };
  }

  @Delete('/:id')
  @HttpCode(200)
  @UseGuards(RoleGuard)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<null>> {
    await this.userService.delete(id);
    return {
      success: true,
      data: null,
      errors: [],
    };
  }
}
