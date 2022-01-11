import { IsString } from "class-validator";

export class UserCreateDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsString()
  walletAddress!: string;
}

export class UserFindDto {
  @IsString()
  username!: string;
  @IsString()
  password!: string;
}

export class UserSignDto {
  @IsString()
  walletAddress!: string
  @IsString()
  username!: string
}
