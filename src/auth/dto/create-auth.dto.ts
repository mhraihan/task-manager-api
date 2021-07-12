import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @MinLength(2)
  @MaxLength(22)
  username: string;

  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'weak password',
  })
  password: string;
}
