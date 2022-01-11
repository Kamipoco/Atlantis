import { HeroInstance } from "@/interfaces/hero";
import { UserInstance } from "@/interfaces/user";
import { Hero } from "@/models/hero";
import { User } from "@models/user"
import { expect, request } from "chai"
import server from './utils/server'

describe('GET hero API', () => {
  let user1: UserInstance;
  let user2: UserInstance;
  let token1: string;
  let token2: string;
  let hero1: HeroInstance;
  let hero2: HeroInstance;
  let hero3: HeroInstance;

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

    // create heroes for testing
    hero1 = await Hero.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 9,
      hp: 3.8,
      atk: 1.3,
      pdef: -0.1,
      level: 2,
      stars: 1,
      rarity: 'R',
      nftType: 'HERO',
      race: 'Atlantis',
      class: 'Warrior',
      colors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']
    });

    hero2 = await Hero.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 12,
      hp: 4.1,
      atk: 2.3,
      pdef: -0.6,
      level: 1,
      stars: 2,
      rarity: 'SR',
      nftType: 'HERO',
      race: 'Xebel',
      class: 'Mage',
      colors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']
    });

    hero3 = await Hero.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c9',
      tokenId: 16,
      hp: 3.1,
      atk: 2.6,
      pdef: -0.8,
      level: 3,
      stars: 1,
      rarity: 'SSR',
      nftType: 'HERO',
      race: 'Trench',
      class: 'Lancer',
      colors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']
    });
  });

  after(async () => {
    await hero1.destroy();
    await hero2.destroy();
    await hero3.destroy();
    await user1.destroy();
    await user2.destroy();
  });

  it('it should return the hero owned by user', async () => {
    const res = await request(server).get('/heroes/9').set({ 'Authorization': `Bearer ${token1}` });
    expect(res.status).to.equal(200);
    expect(res.body.data).to.deep.equal(hero1.toJSON());
  });

  it('it should return error when user does not own the hero', async () => {
    const res = await request(server).get('/heroes/9').set({ 'Authorization': `Bearer ${token2}` });
    expect(res.status).to.equal(403);
    expect(res.body.error.message).to.equal('You have no access to this hero');
  });

  it('it should response not found when there is no hero with the tokenId', async () => {
    const res = await request(server).get('/heroes/11').set({ 'Authorization': `Bearer ${token1}` });
    expect(res.status).to.equal(404);
    expect(res.body.error.message).to.equal('Hero not found');
  });

  it('it should response an array of heroes owned by user with correct page and limit', async () => {
    const res = await request(server).get('/heroes?page=2&limit=1&type=ALL').set({ 'Authorization': `Bearer ${token1}` });
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.equal(1);
    expect(res.body.data[0]).to.deep.equal(hero2.toJSON());
  });

  it('it should response an array of heroes owned by user with correct type', async () => {
    const res = await request(server).get('/heroes?page=1&limit=2&type=WARRIOR').set({ 'Authorization': `Bearer ${token1}` });
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.equal(1);
    expect(res.body.data[0]).to.deep.equal(hero1.toJSON());
  });

  it('it should response an array of heroes owned by user with correct rank', async () => {
    const res = await request(server).get('/heroes?page=1&limit=2&type=ALL&rank=SR').set({ 'Authorization': `Bearer ${token1}` });
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.equal(1);
    expect(res.body.data[0]).to.deep.equal(hero2.toJSON());
  });

  it('it should response an array of heroes owned by user with correct order by HIGHEST_RANK', async () => {
    const res = await request(server).get('/heroes?page=1&limit=2&type=ALL&sort=HIGHEST_RANK').set({ 'Authorization': `Bearer ${token1}` });
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.equal(2);
    expect(res.body.data[0]).to.deep.equal(hero2.toJSON());
    expect(res.body.data[1]).to.deep.equal(hero1.toJSON());
  });

  it('it should response an array of heroes owned by user with correct order by HIGHEST_LEVEL', async () => {
    const res = await request(server).get('/heroes?page=1&limit=2&type=ALL&sort=HIGHEST_LEVEL').set({ 'Authorization': `Bearer ${token1}` });
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.equal(2);
    expect(res.body.data[0]).to.deep.equal(hero1.toJSON());
    expect(res.body.data[1]).to.deep.equal(hero2.toJSON());
  });
});
