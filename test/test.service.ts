import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private PrismaService: PrismaService) {}

  async deleteUser() {
    await this.PrismaService.user.deleteMany({});
  }

  // async clearUser

  async createUser() {
    return await this.PrismaService.user.create({
      data: {
        username: 'test',
        name: 'John Doe',
        email: 'test@example.com',
        phone: '1234567890',
        password: await bcrypt.hash('test', 10),
        token: 'test',
        role: 'PARTICIPANT',
      },
    });
  }

  async createUserAdmin() {
    return await this.PrismaService.user.create({
      data: {
        username: 'admin',
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '1234567891',
        password: await bcrypt.hash('test', 10),
        token: 'admin',
        role: 'ADMIN',
      },
    });
  }
}
