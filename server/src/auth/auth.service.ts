import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(email: string, name: string, password: string, profilePic?: string) {
    const hashed = await bcrypt.hash(password, 10);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('User already exists');

    const user = await prisma.user.create({
      data: { email, name, password: hashed, role: 'USER', profilePic: profilePic ?? null },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationCode.create({
      data: {
        email: email,
        code,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
      },
    });

    // TODO: send code via email (nodemailer) or SMS (Twilio)

    return { message: 'User registered. Please verify your account.', email: user.email };
  }

  async login(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    if (!user.isVerified) throw new Error('Please verify your email before login.');

    return user;
  }

  async verifyUser(email: string, code: string) {
    const verification = await prisma.verificationCode.findFirst({
      where: { email, code },
    });

    if (!verification) {
      throw new Error('Invalid or expired verification code');
    }

    await prisma.user.update({
      where: { email: email },
      data: { isVerified: true },
    });

    await prisma.verificationCode.delete({
      where: { id: verification.id },
    });

    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new Error('User not found');
    }
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
