import 'dotenv/config';
import * as chai from 'chai';
import chaiHttp from "chai-http";
import { expect, request } from 'chai';
import { InfoVerifySignature } from './interface/message';
import { signMessage } from './utils/signMessage';
import { UserCreate } from './interface/user';
import { ethers, Wallet } from 'ethers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import server from './utils/server'

chai.use(chaiHttp);

describe("Login api", async () => {
  let signer: Wallet;
  beforeEach(async () => {
    const privateKey = process.env.PRIVATE_KEY as string;
    const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
    signer = new ethers.Wallet(privateKey, provider);
  });
  //Test get send message routes
  it("GET /message/send", async () => {
    const res = await request(server).post("/message/send").send({ userWalletAddress: await signer.getAddress() });
    const status = res.status;
    expect(status).to.equal(200);
  });

  it("POST /message/verify", async () => {
    let res = await request(server).post("/message/send").send({ userWalletAddress: await signer.getAddress() });
    const message = res.body.data;

    const info: InfoVerifySignature = await signMessage(message, await signer.getAddress());
    res = await request(server).post("/message/verify").send(info);
    expect(res.status).to.equal(200);
  });

  it("POST /user/register", async () => {
    let res = await request(server).post("/message/send").send({ userWalletAddress: await signer.getAddress() });
    const message = res.body.data;
    const info: InfoVerifySignature = await signMessage(message, await signer.getAddress());
    res = await request(server).post("/message/verify").send(info);
    const token = res.body.data;

    const userData: UserCreate = {
      username: "phatngt",
      password: "phat12345",
      walletAddress: (await signer.getAddress())
    };

    res = await request(server).post("/user/generateAccount").set({ "Authorization": `Bearer ${token}` }).send(userData);
    const resBody = res.status;
    expect(resBody).to.equal(200);
  });

  it("POST /user/login", async () => {
    const dataLoginUser = {
      username: "phatngt",
      password: "phat12345"
    }
    const res = await request(server).post('/user/login').send(dataLoginUser);
    const userToken: string | JwtPayload = jwt.verify(res.body.data, 'secret');
    const userData = (userToken as JwtPayload).user;
    expect(userData.username).to.equal(dataLoginUser.username);
    expect(userData.walletAddress).to.equal(await signer.getAddress());
  });

});
