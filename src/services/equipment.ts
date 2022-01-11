import { HttpException } from "@/exceptions/HttpException";
import { ArmorInstance } from "@/interfaces/armor";
import { UserInstance } from "@/interfaces/user";
import { WeaponInstance } from "@/interfaces/weapon";
import { sequelize } from "@/models";
import { Armor } from "@/models/armor";
import { Hero } from '@/models/hero';
import { Weapon } from "@/models/weapon";

export default class EquipmentService {
  public async equip(heroTokenId: string, user: UserInstance) {
    const hero = await Hero.findOne({ where: { tokenId: heroTokenId } });

    if (!hero) {
      throw new HttpException(404, 'Hero not found');
    }

    if (hero.walletAddress !== user.walletAddress) {
      throw new HttpException(403, 'You have access to this hero')
    }

    let currentWeapon: WeaponInstance | null = null;
    let currentArmor: ArmorInstance | null = null;

    if (hero.equippedWeaponTokenId && hero.equippedArmorTokenId) {
      currentWeapon = await Weapon.findOne({ where: { tokenId: hero.equippedWeaponTokenId } });
      currentArmor = await Armor.findOne({ where: { tokenId: hero.equippedArmorTokenId } });
    }

    let availableWeapons = await Weapon.findAll({ where: { equippedHeroTokenId: null } });
    let availableArmors = await Armor.findAll({ where: { equippedHeroTokenId: null } });

    availableWeapons = availableWeapons.sort((a, b) => this.compareTwoWeapons(a, b));

    availableArmors = availableArmors.sort((a, b) => this.compareTwoArmors(a, b));

    if (currentWeapon && currentArmor) {
      const transaction = await sequelize.transaction();

      try {
        if (availableWeapons.length && this.compareTwoWeapons(currentWeapon, availableWeapons[0]) === 1) {
          await currentWeapon.update({ equippedHeroTokenId: null }, { transaction });
          await currentWeapon.save();

          await hero.update({ equippedWeaponTokenId: availableWeapons[0].tokenId }, { transaction });
          await hero.save();

          await availableWeapons[0].update({ equippedHeroTokenId: hero.tokenId }, { transaction });
          await availableWeapons[0].save();
        }

        if (availableArmors.length && this.compareTwoArmors(currentArmor, availableArmors[0]) === 1) {
          await currentArmor.update({ equippedHeroTokenId: null }, { transaction });
          await currentArmor.save();

          await hero.update({ equippedArmorTokenId: availableArmors[0].tokenId }, { transaction });
          await hero.save();

          await availableArmors[0].update({ equippedHeroTokenId: hero.tokenId }, { transaction });
          await availableArmors[0].save();
        }

        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw new HttpException(500, 'Equip failed');
      }
    } else {
      if (availableWeapons.length === 0 || availableArmors.length === 0) return 'ok';

      const transaction = await sequelize.transaction();

      try {
        await availableWeapons[0].update({ equippedHeroTokenId: hero.tokenId }, { transaction });
        await availableWeapons[0].save();

        await availableArmors[0].update({ equippedHeroTokenId: hero.tokenId }, { transaction });
        await availableArmors[0].save();

        await hero.update({ equippedWeaponTokenId: availableWeapons[0].tokenId, equippedArmorTokenId: availableArmors[0].tokenId }, { transaction });
        await hero.save();

        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw new HttpException(500, 'Equip failed');
      }
    }

    return 'success';
  }

  public async unequip(heroTokenId: string, user: UserInstance) {
    const hero = await Hero.findOne({ where: { tokenId: heroTokenId } });

    if (!hero) {
      throw new HttpException(404, 'Hero not found');
    }

    if (hero.walletAddress !== user.walletAddress) {
      throw new HttpException(403, 'You have access to this hero')
    }

    if (hero.equippedWeaponTokenId && hero.equippedArmorTokenId) {
      const weapon = await Weapon.findOne({ where: { tokenId: hero.equippedWeaponTokenId } });
      const armor = await Armor.findOne({ where: { tokenId: hero.equippedArmorTokenId } });

      const transaction = await sequelize.transaction();

      try {
        if (weapon) {
          await weapon.update({ equippedHeroTokenId: null }, { transaction });
          await weapon.save();
        }

        if (armor) {
          await armor.update({ equippedHeroTokenId: null }, { transaction });
          await armor.save();
        }

        await hero.update({ equippedArmorTokenId: null, equippedWeaponTokenId: null }, { transaction });
        await hero.save();

        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw new HttpException(500, 'Unequip failed');
      }
    }
  }

  private compareTwoWeapons(a: WeaponInstance, b: WeaponInstance): number {
    if (a.stars > b.stars) {
      return -1;
    } else if (a.stars < b.stars) {
      return 1;
    } else {
      if (a.level > b.level) {
        return -1;
      } else if (a.level < b.level) {
        return 1;
      } else {
        if (a.atk > b.atk) {
          return -1;
        } else if (a.atk < b.atk) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  }

  private compareTwoArmors(a: ArmorInstance, b: ArmorInstance): number {
    if (a.stars > b.stars) {
      return -1;
    } else if (a.stars < b.stars) {
      return 1;
    } else {
      if (a.level > b.level) {
        return -1;
      } else if (a.level < b.level) {
        return 1;
      } else {
        if (a.hp > b.hp) {
          return -1;
        } else if (a.hp < b.hp) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  }
}
