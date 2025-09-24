import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  async register(@Args('email') email: string, @Args('name') name: string, @Args('password') password: string) {
    const token = await this.authService.register(email, name, password);
    return token.access_token;
  }

  @Mutation(() => String)
  async login(@Args('email') email: string, @Args('password') password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new Error('Invalid credentials');
    const token = await this.authService.login(user);
    return token.access_token;
  }
}
