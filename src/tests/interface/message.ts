
export interface InfoVerifySignature {
  _userWalletAddress: string;
  _signature: string;
}

export interface InfoConfirmSignedMessage {
  data: boolean;
  message: string;
}
