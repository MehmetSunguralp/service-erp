import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async findAll() {
    return prisma.user.findMany();
  }

  async createUser(data: { email: string; name: string; password: string; profilePic?: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        profilePic: data.profilePic,
      },
    });
  }
}
