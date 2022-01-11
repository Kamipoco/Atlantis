import { UserInstance } from "@/interfaces/user";
import { User } from "@models/user"
import { expect, request } from "chai"
import server from './utils/server'

describe('GET setting API', () => {
  let user: UserInstance;
  let token: string;

  before(async () => {
    // create a user for testing
    user = await User.create({
      username: 'qbao',
      password: 'qbao',
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      nonce: 40832
    });

    // Login to get token
    const res = await request(server).post('/user/login').send({
      username: 'qbao',
      password: 'qbao'
    });

    token = res.body.data;
  });

  after(async () => {
    await user.destroy();
  });

  it('it should response with maxStamina and staminaInSecond values', async () => {
    const res = await request(server).get('/setting').set({ 'Authorization': `Bearer ${token}` });
    expect(res.status).to.equal(200);
    expect(res.body.data.maxStamina).to.be.a('number');
    expect(res.body.data.staminaInSecond).to.be.a('number');
  });
});
