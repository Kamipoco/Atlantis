import { ArmorInstance } from "@/interfaces/armor";
import { HeroInstance } from "@/interfaces/hero";
import { MarketplaceInstance } from "@/interfaces/marketplace";
import { UserInstance } from "@/interfaces/user";
import { WeaponInstance } from "@/interfaces/weapon";
import { Armor } from "@/models/armor";
import { Hero } from "@/models/hero";
import { Marketplace } from "@/models/marketplace";
import { User } from "@/models/user";
import { Weapon } from "@/models/weapon";
import { expect, request } from "chai"
import server from './utils/server'

describe('inventory APIs', () => {
  let user: UserInstance;
  let token: string;
  let marketplaceItem1: MarketplaceInstance;
  let marketplaceItem2: MarketplaceInstance;
  let marketplaceItem3: MarketplaceInstance;
  let hero1: HeroInstance;
  let weapon1: WeaponInstance;
  let armor1: ArmorInstance;
  let hero2: HeroInstance;
  let weapon2: WeaponInstance;
  let armor2: ArmorInstance;

  before(async () => {
    user = await User.create({
      username: 'qbao',
      password: 'qbao',
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      nonce: 40832
    });

    const res = await request(server).post('/user/login').send({
      username: 'qbao',
      password: 'qbao'
    });

    token = res.body.data;

    marketplaceItem1 = await Marketplace.create({ id: '1472aa4d-03a2-4c4c-a41b-7003f704e4a1', price: '1', itemId: 1 });
    marketplaceItem2 = await Marketplace.create({ id: '1472aa4d-03a2-4c4c-a41b-7003f704e4a2', price: '1', itemId: 2 });
    marketplaceItem3 = await Marketplace.create({ id: '1472aa4d-03a2-4c4c-a41b-7003f704e4a3', price: '1', itemId: 3 });

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
      colors: {
        arm: 1,
        body: 2,
        helmet: 5,
        belt: 4
      },
      marketplaceId: '1472aa4d-03a2-4c4c-a41b-7003f704e4a1'
    });

    hero2 = await Hero.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 11,
      hp: 3.8,
      atk: 1.3,
      pdef: -0.1,
      level: 2,
      stars: 1,
      rarity: 'R',
      nftType: 'HERO',
      race: 'Atlantis',
      class: 'Warrior',
      colors: {
        arm: 1,
        body: 2,
        helmet: 5,
        belt: 4
      }
    });

    weapon1 = await Weapon.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 9,
      atk: 1.3,
      perk: 1,
      level: 2,
      stars: 1,
      rarity: 'R',
      nftType: 'WEAPON',
      class: 'Warrior',
      marketplaceId: '1472aa4d-03a2-4c4c-a41b-7003f704e4a2'
    });

    weapon2 = await Weapon.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 11,
      atk: 1.3,
      perk: 1,
      level: 2,
      stars: 1,
      rarity: 'R',
      nftType: 'WEAPON',
      class: 'Warrior'
    });

    armor1 = await Armor.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 9,
      hp: 1.3,
      perk: 1,
      level: 1,
      stars: 2,
      rarity: 'SR',
      nftType: 'ARMOR',
      class: 'Mage',
      marketplaceId: '1472aa4d-03a2-4c4c-a41b-7003f704e4a3'
    });

    armor2 = await Armor.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 11,
      hp: 1.3,
      perk: 1,
      level: 1,
      stars: 2,
      rarity: 'SR',
      nftType: 'ARMOR',
      class: 'Mage'
    });
  });

  after(async () => {
    await hero1.destroy();
    await weapon1.destroy();
    await armor1.destroy();
    await hero2.destroy();
    await weapon2.destroy();
    await armor2.destroy();
    await marketplaceItem1.destroy();
    await marketplaceItem2.destroy();
    await marketplaceItem3.destroy();
    await user.destroy();
  });

  it('it should get a list of heroes including on-game and on-marketplace', async () => {
    const res = await request(server).get('/inventory/heroes?page=1&limit=10').set({ 'Authorization': `Bearer ${token}` });
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.greaterThanOrEqual(2);
  });

  it('it should get a list of weapons including on-game and on-marketplace', async () => {
    const res = await request(server).get('/inventory/weapons?page=1&limit=10').set({ 'Authorization': `Bearer ${token}` });
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.greaterThanOrEqual(2);
  });

  it('it should get a list of armors including on-game and on-marketplace', async () => {
    const res = await request(server).get('/inventory/armors?page=1&limit=10').set({ 'Authorization': `Bearer ${token}` });
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.greaterThanOrEqual(2);
  });

  it('it should return unauthorized when request have no jwt', async () => {
    const res = await request(server).get('/inventory/heroes?page=1&limit=10');
    expect(res.status).to.equal(401);
  });

  describe('it should return bad request with invalid filter params', () => {
    it('invalid class', async () => {
      const res = await request(server).get('/inventory/heroes?page=1&limit=10&class=asdasd').set({ 'Authorization': `Bearer ${token}` });
      expect(res.status).to.equal(400);
    });

    it('invalid race', async () => {
      const res = await request(server).get('/inventory/heroes?page=1&limit=10&race=asdasd').set({ 'Authorization': `Bearer ${token}` });
      expect(res.status).to.equal(400);
    });

    it('invalid rarity', async () => {
      const res = await request(server).get('/inventory/heroes?page=1&limit=10&rarity=asdasd').set({ 'Authorization': `Bearer ${token}` });
      expect(res.status).to.equal(400);
    });

    it('invalid level', async () => {
      const res = await request(server).get('/inventory/heroes?page=1&limit=10&level=101').set({ 'Authorization': `Bearer ${token}` });
      expect(res.status).to.equal(400);
    });

    it('invalid stars', async () => {
      const res = await request(server).get('/inventory/heroes?page=1&limit=10&stars=6').set({ 'Authorization': `Bearer ${token}` });
      expect(res.status).to.equal(400);
    });
  });
});
