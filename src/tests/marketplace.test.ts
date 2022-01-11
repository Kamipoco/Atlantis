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

describe('market APIs', () => {
  let user: UserInstance;
  let token: string;
  let marketplaceItem1: MarketplaceInstance;
  let marketplaceItem2: MarketplaceInstance;
  let marketplaceItem3: MarketplaceInstance;
  let hero: HeroInstance;
  let weapon: WeaponInstance;
  let armor: ArmorInstance;

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

    hero = await Hero.create({
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

    weapon = await Weapon.create({
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

    armor = await Armor.create({
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
  });

  after(async () => {
    await hero.destroy();
    await weapon.destroy();
    await armor.destroy();
    await marketplaceItem1.destroy();
    await marketplaceItem2.destroy();
    await marketplaceItem3.destroy();
    await user.destroy();
  });

  it('it should get a list of heroes listing in the marketplace', async () => {
    const res = await request(server).get('/market/heroes?page=1&limit=10');
    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.greaterThanOrEqual(1);
  });

  it('it should get the hero by tokenId', async () => {
    const res = await request(server).get('/market/heroes/9');
    expect(res.status).to.equal(200);
    expect(res.body.data.tokenId).to.equal(9);
    expect(res.body.data.Marketplace.price).to.equal('1');
    expect(res.body.metadata.contractAddress).to.be.a.string;
  });

  it('it should get the weapon by tokenId', async () => {
    const res = await request(server).get('/market/weapons/9');
    expect(res.status).to.equal(200);
    expect(res.body.data.tokenId).to.equal(9);
    expect(res.body.data.Marketplace.price).to.equal('1');
    expect(res.body.metadata.contractAddress).to.be.a.string;
  });

  it('it should get the armor by tokenId', async () => {
    const res = await request(server).get('/market/armors/9');
    expect(res.status).to.equal(200);
    expect(res.body.data.tokenId).to.equal(9);
    expect(res.body.data.Marketplace.price).to.equal('1');
    expect(res.body.metadata.contractAddress).to.be.a.string;
  });

  it('it should return not found with unexisting tokenId', async () => {
    const res = await request(server).get('/market/heroes/11');
    expect(res.status).to.equal(404);
    expect(res.body.error.message).to.equal('Hero not found or not listed in the marketplace');
  });
});

describe('Make voucher ', () => {
  it("Get voucher", async () => {
    const id = "9bddf7cd-31a3-44fa-ba8a-bcbcc96e1a3a" // Change here
    const walletAddress = "0x208E44440E3A05d39dd63677F2E8A20FD39382D5";
    const res = await request(server).get(`/market/voucher?id=${id}&walletAddress=${walletAddress}`);
    console.log("data: ", res.body.data);
    expect(res.status).to.equal(200);
    expect(res.body.data.redeemer).to.equal(walletAddress);
    expect(res.body.data.nonce).to.not.equal(null);
  });

});
