import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsInt()
  @Min(0)
  @Max(150)
  age: number;

  @IsBoolean()
  isAdmin: boolean;
}