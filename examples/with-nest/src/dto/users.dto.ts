import { Exclude, Type } from 'class-transformer'
import { IsNumber, IsString, Length, Max, Min } from 'class-validator'

export class Users {
  @Type(() => CreateUserDto)
  users: CreateUserDto[] = []

  constructor(...users: CreateUserDto[]) {
    this.users = users
  }
}

export class CreateUserDto {
  @IsNumber()
  @Exclude({ toPlainOnly: true })
  id: number

  @IsString()
  @Length(1, 20)
  name: string

  @IsNumber()
  @Min(12)
  @Max(100)
  age: number

  constructor(id: number, name: string, age: number) {
    this.id = id
    this.name = name
    this.age = age
  }
}

export const initialUsersData = new Users(
  new CreateUserDto(1, 'John', 20),
  new CreateUserDto(2, 'Jane', 21),
  new CreateUserDto(3, 'Jack', 22)
)
