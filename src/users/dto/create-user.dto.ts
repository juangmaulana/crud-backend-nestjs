import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsBoolean,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer'; 

export class CreateUserDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsInt()
  @Min(0)
  @Max(150)
  age: number;

  @IsOptional() 
  @IsBoolean()
  isAdmin: boolean;
}