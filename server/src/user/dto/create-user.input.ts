import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;

  @Field()
  role: 'ADMIN' | 'MODERATOR' | 'USER';

  @Field({ nullable: true })
  profilePic?: string;
}
