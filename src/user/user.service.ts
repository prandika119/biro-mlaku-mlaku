import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
// import { PrismaService } from 'src/common/prisma.service';
import { PrismaService } from '../common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
  UserUpdateRequest,
} from '../model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info('Registering new user', { request });

    const registerRequest: RegisterUserRequest =
      this.validationService.validate(
        UserValidation.REGISTER,
        request,
      ) as RegisterUserRequest;
    this.logger.info('Validated register request', { registerRequest });
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: registerRequest.email },
          { username: registerRequest.username },
          { phone: registerRequest.phone },
        ],
      },
    });

    if (existingUser) {
      let errorMessage = 'User already exists';

      if (existingUser.email === registerRequest.email) {
        errorMessage = 'Email already registered';
      } else if (existingUser.username === registerRequest.username) {
        errorMessage = 'Username already registered';
      } else if (existingUser.phone === registerRequest.phone) {
        errorMessage = 'Phone number already registered';
      }
      throw new HttpException(errorMessage, 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        username: registerRequest.username,
        email: registerRequest.email,
        name: registerRequest.name,
        phone: registerRequest.phone,
        password: registerRequest.password,
      },
    });
    return user; // Placeholder return
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.info('User login attempt', { request });
    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    ) as LoginUserRequest;
    this.logger.info('Validated login request', { loginRequest });

    let user = await this.prismaService.user.findUnique({
      where: { email: loginRequest.email },
    });

    if (!user) {
      throw new HttpException('Invalid email or password', 400);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid email or password', 400);
    }

    user = await this.prismaService.user.update({
      where: {
        email: loginRequest.email,
      },
      data: {
        token: uuid(),
      },
    });

    return user; // Placeholder return
  }

  async getAll(): Promise<UserResponse[]> {
    const users = await this.prismaService.user.findMany();
    return users;
  }

  async get(user: User): Promise<UserResponse> {
    return user;
  }

  async update(
    user: User,
    request: Partial<UserUpdateRequest>,
  ): Promise<UserResponse> {
    const updateRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    ) as Partial<UserResponse>;

    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        username: updateRequest.username,
        name: updateRequest.name,
        email: updateRequest.email,
        phone: updateRequest.phone,
      },
    });

    return updatedUser;
  }

  async adminUpdate(
    id: number,
    request: Partial<UserUpdateRequest>,
  ): Promise<UserResponse> {
    const updateRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    ) as Partial<UserResponse>;

    const updatedUser = await this.prismaService.user.update({
      where: { id: id },
      data: {
        username: updateRequest.username,
        name: updateRequest.name,
        email: updateRequest.email,
        phone: updateRequest.phone,
      },
    });
    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }
    await this.prismaService.user.delete({
      where: { id: id },
    });
  }
}
