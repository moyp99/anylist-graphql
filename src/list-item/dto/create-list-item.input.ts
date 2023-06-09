import { InputType, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {
  @Field(() => Number, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity = 0;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  completed = false;

  @IsUUID()
  @Field(() => ID)
  listId: string;

  @IsUUID()
  @Field(() => ID)
  itemId: string;
}
