import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async users() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async me(@Context() context) {
    const userId = context.req.user.id;
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput) {
    return this.userService.createUser(data);
  }
}
