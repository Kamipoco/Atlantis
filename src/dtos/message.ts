import { IsNumber, IsString } from "class-validator"
export class SignedMessageDto {
  @IsString()
  _userWalletAddress!: string

  @IsString()
  _signature!: string

}

export class VerifiedInfoDto {
  @IsString()
  walletAddress!: string
  @IsNumber()
  nonce!: number
}
