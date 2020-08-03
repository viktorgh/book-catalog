import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class BookInput {
  @Field({ nullable: false })
  title?: string;

  @Field({ nullable: true })
  authorIds: number[];
}

