import { UserInstance } from "@/interfaces/user";
import { WeaponInstance } from "@/interfaces/weapon";
import { Weapon } from "@/models/weapon";
import { User } from "@models/user"
import { expect, request } from "chai"
import server from './utils/server'

describe('GET weapon API', () => {
  let user1: UserInstance;
  let user2: UserInstance;
  let token1: string;
  let token2: string;
  let weapon1: WeaponInstance;
  let weapon2: WeaponInstance;
  let weapon3: WeaponInstance;

  before(async () => {
    // create users for testing
    user1 = await User.create({
      username: 'qbao',
      password: 'qbao',
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      nonce: 40832
    });

    user2 = await User.create({
      username: 'reus',
      password: 'reus',
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c9',
      nonce: 40786
    });

    // Login to get tokens
    let res = await request(server).post('/user/login').send({
      username: 'qbao',
      password: 'qbao'
    });

    token1 = res.body.data;

    res = await request(server).post('/user/login').send({
      username: 'reus',
      password: 'reus'
    });

    token2 = res.body.data;

    // create weapons for testing
    weapon1 = await Weapon.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 9,
      atk: 1.3,
      perk: 1,
      level: 2,
      stars: 1,
      rarity: 'R',
      nftType: 'WEAPON',
      class: 'Warrior'
    });

    weapon2 = await Weapon.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 12,
      atk: 1.3,
      perk: 1,
      level: 1,
      stars: 2,
      rarity: 'SR',
      nftType: 'WEAPON',
      class: 'Mage'
    });

    weapon3 = await Weapon.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c9',
      tokenId: 16,
      atk: 1.3,
      perk: 1,
      level: 3,
      stars: 1,
      rarity: 'SSR',
      nftType: 'WEAPON',
      class: 'Lancer'
    });
  });

  after(async () => {
    await weapon1.destroy();
    await weapon2.destroy();
    await weapon3.destroy();
    await user1.destroy();
    await user2.destroy();
  });

  it('it should return the weapon owned by user', async () => {
    const res = await request(server).get('/weapons/9').set({ 'Authorization': `Bearer ${token1}` });
    expect(res.status).to.equal(200);
    expect(res.body.data).to.deep.equal(weapon1.toJSON());
  });

  it('it should return error when user does not own the weapon', async () => {
    const res = await request(server).get('/weapons/9').set({ 'Authorization': `Bearer ${token2}` });
    expect(res.status).to.equal(403);
    expect(res.body.error.message).to.equal('You have no access to this weapon');
  });

  it('it should response not found when there is no weapon with the tokenId', async () => {
    const res = await request(server).get('/weapons/11').set({ 'Authorization': `Bearer ${token1}` });
    expect(res.status).to.equal(404);
    expect(res.body.error.message).to.equal('Weapon not found');
  });

  it('it should response an array of weapons owned by user with correct page and limit', async () => {
    const res = await request(server).get('/weapons?page=2&limit=1&type=ALL').set({ 'Authorization': `Bearer ${token1}` });
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.equal(1);
    expect(res.body.data[0]).to.deep.equal(weapon2.toJSON());
  });

  it('it should response an array of weapons owned by user with correct type', async () => {
    const res = await request(server).get('/weapons?page=1&limit=2&type=WARRIOR').set({ 'Authorization': `Bearer ${token1}` });
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.equal(1);
    expect(res.body.data[0]).to.deep.equal(weapon1.toJSON());
  });

  it('it should response an array of weapons owned by user with correct rank', async () => {
    const res = await request(server).get('/weapons?page=1&limit=2&type=ALL&rank=SR').set({ 'Authorization': `Bearer ${token1}` });
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.equal(1);
    expect(res.body.data[0]).to.deep.equal(weapon2.toJSON());
  });

  it('it should response an array of weapons owned by user with correct order by HIGHEST_RANK', async () => {
    const res = await request(server).get('/weapons?page=1&limit=2&type=ALL&sort=HIGHEST_RANK').set({ 'Authorization': `Bearer ${token1}` });
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.equal(2);
    expect(res.body.data[0]).to.deep.equal(weapon2.toJSON());
    expect(res.body.data[1]).to.deep.equal(weapon1.toJSON());
  });

  it('it should response an array of weapons owned by user with correct order by HIGHEST_LEVEL', async () => {
    const res = await request(server).get('/weapons?page=1&limit=2&type=ALL&sort=HIGHEST_LEVEL').set({ 'Authorization': `Bearer ${token1}` });
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.equal(2);
    expect(res.body.data[0]).to.deep.equal(weapon1.toJSON());
    expect(res.body.data[1]).to.deep.equal(weapon2.toJSON());
  });
});
