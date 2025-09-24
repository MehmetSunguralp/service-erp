import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async users() {
    return this.userService.findAll();
  }

  @UseGuards(GqlAuthGuard)
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
