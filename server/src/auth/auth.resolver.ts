import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterResponse } from 'src/types/ObjectTypes';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('email') email: string,
    @Args('name') name: string,
    @Args('password') password: string,
    @Args('profilePic', { nullable: true }) profilePic?: string,
  ): Promise<RegisterResponse> {
    const result = await this.authService.register(email, name, password, profilePic);
    return { message: result.message, email: result.email };
  }

  @Mutation(() => String)
  async login(@Args('email') email: string, @Args('password') password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new Error('Invalid credentials');
    const token = await this.authService.login(user);
    return token.access_token;
  }

  @Mutation(() => String)
  async verifyUser(@Args('email') email: string, @Args('code') code: string) {
    const token = await this.authService.verifyUser(email, code);
    return token.access_token;
  }
}
