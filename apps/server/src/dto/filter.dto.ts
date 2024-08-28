import { Field, InputType, Int } from 'type-graphql'


@InputType()
export class StringFilter {
  @Field(() => String, { nullable: true })
  eq?: string

  @Field(() => String, { nullable: true })
  ne?: string

  @Field(() => String, { nullable: true })
  gt?: string

  @Field(() => String, { nullable: true })
  gte?: string

  @Field(() => String, { nullable: true })
  lt?: string

  @Field(() => String, { nullable: true })
  lte?: string

  @Field(() => String, { nullable: true })
  contains?: string

  @Field(() => String, { nullable: true })
  notContains?: string

  @Field(() => [String], { nullable: true })
  in?: string[]

  @Field(() => [String], { nullable: true })
  notIn?: string[]

  @Field(() => [String], { nullable: true })
  between?: string[]

  @Field(() => [String], { nullable: true })
  notBetween?: string[]

}

@InputType()
export class IntFilter {
  @Field(() => Int, { nullable: true })
  eq?: number

  @Field(() => Int, { nullable: true })
  ne?: number

  @Field(() => Int, { nullable: true })
  gt?: number

  @Field(() => Int, { nullable: true })
  gte?: number

  @Field(() => Int, { nullable: true })
  lt?: number

  @Field(() => Int, { nullable: true })
  lte?: number

  @Field(() => Int, { nullable: true })
  contains?: number

  @Field(() => Int, { nullable: true })
  notContains?: number

  @Field(() => [Int], { nullable: true })
  in?: number[]

  @Field(() => [Int], { nullable: true })
  notIn?: number[]

  @Field(() => [Int], { nullable: true })
  between?: number[]

  @Field(() => [Int], { nullable: true })
  notBetween?: number[]
}


@InputType()
export class DateFilter {
  @Field(() => Date, { nullable: true })
  eq?: Date

  @Field(() => Date, { nullable: true })
  ne?: Date

  @Field(() => Date, { nullable: true })
  gt?: Date

  @Field(() => Date, { nullable: true })
  gte?: Date

  @Field(() => Date, { nullable: true })
  lt?: Date

  @Field(() => Date, { nullable: true })
  lte?: Date

  @Field(() => [Date], { nullable: true })
  in?: Date[]

  @Field(() => [Date], { nullable: true })
  notIn?: Date[]

  @Field(() => [Date], { nullable: true })
  between?: Date[]

  @Field(() => [Date], { nullable: true })
  notBetween?: Date[]

}