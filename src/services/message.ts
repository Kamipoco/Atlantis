import { SignedMessageDto, VerifiedInfoDto } from '@/dtos/message';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@/models/user';
import { ethers } from 'ethers';
import { isEmpty } from 'lodash';
import jwt from "jsonwebtoken";
export default class MessageService {
	private message = 'I am sigining in Atlantis World | OTP: ';

	public async sendMessageAndNonce(userWalletAddress: string): Promise<string> {
		if (isEmpty(userWalletAddress)) {
			throw new HttpException(400, "Not enought data");
		}
		let nonce: number; // Nonce like the otp, used to verify wallet address.
		const user = await User.findOne({ where: { walletAddress: userWalletAddress } });	// Query the user in the user model by wallet address.
		if (isEmpty(user)) {
			nonce = Math.floor(Math.random() * 100000);	//Create a random number for the nonce
			await User.create({
				walletAddress: userWalletAddress,
				nonce: nonce
			});	//Create the new user.
		}
		else {
			nonce = user?.getDataValue("nonce") as number; //Get nonce from the user instance.
		}

		return this.message + `${nonce}`;
	}

	public async verifySignature(signedMessageData: SignedMessageDto): Promise<VerifiedInfoDto> {
		if (isEmpty(signedMessageData)) {
			throw new HttpException(400, "Not enough data");
		}

		const user = await User.findOne({ where: { walletAddress: signedMessageData._userWalletAddress } }); // Query the user in the user model by wallet address
		if (isEmpty(user)) {
			throw new HttpException(409, "Wallet address not registered yet");
		}
		const nonce = user?.getDataValue("nonce");	//Get the nonce number
		const message = this.message + `${nonce}`; //Concate the message and nonce number
		const signingAddress = ethers.utils.verifyMessage(message, signedMessageData._signature); //Get address in the signature

		if (signingAddress !== signedMessageData._userWalletAddress) {
			throw new HttpException(409, "Signature not valid");
		} // Check valid signature

		const newNonce: number = Math.floor(Math.random() * 100000);
		await user?.update({ nonce: newNonce });
		await user?.save();	//Update the nonce number for the user

		const body: VerifiedInfoDto = {
			walletAddress: user?.getDataValue("walletAddress") as string,
			nonce: newNonce
		};	//Create infomation for creation jwt

		return body;
	}

	public makeJWT(body: VerifiedInfoDto): string {
		const jwtUser = jwt.sign({ user: body }, process.env.SECRET_KEY as jwt.Secret);	//Create jwt token
		return jwtUser;
	}
}
