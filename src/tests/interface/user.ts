export interface UserCreate {
  username: string;
  password: string;
  walletAddress: string;
}

export interface VerifyUser {
  username: string;
  walletAddress: string;
}
