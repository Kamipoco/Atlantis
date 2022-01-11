import { UserInstance } from "@/interfaces/user";
import { User } from "@models/user"
import { expect, request } from "chai"
import server from './utils/server'

describe('GET stamina API', () => {
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

  it('it should response ok and save the lastStaminaInSecond into database', async () => {
    const res = await request(server).get('/user/stamina').set({ 'Authorization': `Bearer ${token}` });
    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.a('number');

    const user = await User.findOne({ where: { username: 'qbao' } });
    const lastStaminaInSecond = user?.getDataValue('lastStaminaInSecond');
    expect(lastStaminaInSecond).to.be.a('number');
  });
});
