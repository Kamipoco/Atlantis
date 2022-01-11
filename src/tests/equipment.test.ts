import { ArmorInstance } from "@/interfaces/armor";
import { HeroInstance } from "@/interfaces/hero";
import { UserInstance } from "@/interfaces/user";
import { WeaponInstance } from "@/interfaces/weapon";
import { Armor } from "@/models/armor";
import { Hero } from "@/models/hero";
import { Weapon } from "@/models/weapon";
import { User } from "@models/user"
import { expect, request } from "chai"
import server from './utils/server'

describe('Equipment API', () => {
  let user: UserInstance;
  let token: string;
  let equippedHero: HeroInstance;
  let hero1: HeroInstance;
  let hero2: HeroInstance;
  let equippedWeapon: WeaponInstance;
  let weapon1: WeaponInstance;
  let weapon2: WeaponInstance;
  let equippedArmor: ArmorInstance;
  let armor1: ArmorInstance;
  let armor2: ArmorInstance;

  beforeEach(async () => {
    // create an user for testing
    user = await User.create({
      username: 'qbao',
      password: 'qbao',
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      nonce: 40832
    });

    // Login to get token
    let res = await request(server).post('/user/login').send({
      username: 'qbao',
      password: 'qbao'
    });

    token = res.body.data;

    // create heroes for testing
    equippedHero = await Hero.create({
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
      colors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
      equippedWeaponTokenId: 18,
      equippedArmorTokenId: 11
    });

    hero1 = await Hero.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 99,
      hp: 3.8,
      atk: 1.3,
      pdef: -0.1,
      level: 2,
      stars: 1,
      rarity: 'R',
      nftType: 'HERO',
      race: 'Atlantis',
      class: 'Warrior',
      colors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
    });

    hero2 = await Hero.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 100,
      hp: 3.8,
      atk: 1.3,
      pdef: -0.1,
      level: 2,
      stars: 1,
      rarity: 'R',
      nftType: 'HERO',
      race: 'Atlantis',
      class: 'Warrior',
      colors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
      equippedWeaponTokenId: 22,
      equippedArmorTokenId: 15
    });

    // create weapons for testing
    equippedWeapon = await Weapon.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 18,
      atk: 1.3,
      perk: 1,
      level: 3,
      stars: 3,
      rarity: 'SSR',
      nftType: 'WEAPON',
      class: 'Lancer',
      equippedHeroTokenId: 9
    });

    weapon1 = await Weapon.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 20,
      atk: 1.3,
      perk: 1,
      level: 3,
      stars: 3,
      rarity: 'SSR',
      nftType: 'WEAPON',
      class: 'Lancer',
    });

    weapon2 = await Weapon.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 22,
      atk: 1.3,
      perk: 1,
      level: 3,
      stars: 2,
      rarity: 'SSR',
      nftType: 'WEAPON',
      class: 'Lancer',
    });

    // create armors for testing
    equippedArmor = await Armor.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 11,
      hp: 1.3,
      perk: 1,
      level: 3,
      stars: 3,
      rarity: 'SSR',
      nftType: 'ARMOR',
      class: 'Lancer',
      equippedHeroTokenId: 9
    });

    armor1 = await Armor.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 13,
      hp: 1.3,
      perk: 1,
      level: 3,
      stars: 3,
      rarity: 'SSR',
      nftType: 'ARMOR',
      class: 'Lancer',
    });

    armor2 = await Armor.create({
      walletAddress: '0xB2463AbBE78281698e92f50C9933f1F8C38F69c7',
      tokenId: 15,
      hp: 1.3,
      perk: 1,
      level: 3,
      stars: 2,
      rarity: 'SSR',
      nftType: 'ARMOR',
      class: 'Lancer',
    });
  });

  afterEach(async () => {
    await equippedHero.destroy();
    await hero1.destroy();
    await hero2.destroy();
    await equippedWeapon.destroy();
    await weapon1.destroy();
    await weapon2.destroy();
    await equippedArmor.destroy();
    await armor1.destroy();
    await armor2.destroy();
    await user.destroy();
  });

  it('it should unequip weapon and armor of the hero', async () => {
    const res = await request(server).post('/equipment/unequip/9').set({ 'Authorization': `Bearer ${token}` });
    expect(res.status).to.equal(200);
    expect(res.body.data).to.equal('success');

    const unequippedWeapon = await Weapon.findOne({ where: { tokenId: 18 } });
    expect(unequippedWeapon!.getDataValue('equippedHeroTokenId')).to.be.null;

    const unequippedArmor = await Armor.findOne({ where: { tokenId: 11 } });
    expect(unequippedArmor!.getDataValue('equippedHeroTokenId')).to.be.null;

    const unequippedHero = await Hero.findOne({ where: { tokenId: 9 } });
    expect(unequippedHero!.getDataValue('equippedWeaponTokenId')).to.be.null;
    expect(unequippedHero!.getDataValue('equippedArmorTokenId')).to.be.null;
  });

  it('it should equip the best armor and weapon for unequipped hero', async () => {
    const res = await request(server).post('/equipment/equip/99').set({ 'Authorization': `Bearer ${token}` });
    expect(res.status).to.equal(200);
    expect(res.body.data).to.equal('success');

    const equippedWeapon = await Weapon.findOne({ where: { tokenId: 20 } });
    expect(equippedWeapon!.getDataValue('equippedHeroTokenId')).to.equal(99);

    const equippedArmor = await Armor.findOne({ where: { tokenId: 13 } });
    expect(equippedArmor!.getDataValue('equippedHeroTokenId')).to.equal(99);

    const equippedHero = await Hero.findOne({ where: { tokenId: 99 } });
    expect(equippedHero!.getDataValue('equippedWeaponTokenId')).to.be.equal(20);
    expect(equippedHero!.getDataValue('equippedArmorTokenId')).to.be.equal(13);
  });

  it('it should equip the better weapon and armor for equipped hero', async () => {
    const res = await request(server).post('/equipment/equip/100').set({ 'Authorization': `Bearer ${token}` });
    expect(res.status).to.equal(200);
    expect(res.body.data).to.equal('success');

    const equippedWeapon = await Weapon.findOne({ where: { tokenId: 20 } });
    expect(equippedWeapon!.getDataValue('equippedHeroTokenId')).to.equal(100);

    const equippedArmor = await Armor.findOne({ where: { tokenId: 13 } });
    expect(equippedArmor!.getDataValue('equippedHeroTokenId')).to.equal(100);

    const equippedHero = await Hero.findOne({ where: { tokenId: 100 } });
    expect(equippedHero!.getDataValue('equippedWeaponTokenId')).to.be.equal(20);
    expect(equippedHero!.getDataValue('equippedArmorTokenId')).to.be.equal(13);

    const unequippedWeapon = await Weapon.findOne({ where: { tokenId: 22 } });
    expect(unequippedWeapon!.getDataValue('equippedHeroTokenId')).to.be.null;

    const unequippedArmor = await Armor.findOne({ where: { tokenId: 15 } });
    expect(unequippedArmor!.getDataValue('equippedHeroTokenId')).to.be.null;
  });
});
