import { User } from '@/models/user'
import { Weapon } from '@/models/weapon'
import { QueryInterface, Sequelize } from 'sequelize'
import { datatype, random } from 'faker'
import { range } from 'lodash'
import { WeaponCreationAttributes } from '@/interfaces/weapon'
import { ItemClass, ItemRarity } from '@/constants/items'

const WEAPONS_PER_USER = 5

export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
  */
  const users = await User.findAll()
  const weaponCount = await Weapon.count()

  const weapons: WeaponCreationAttributes[] = users.reduce((armors, user, index) => {
    range(WEAPONS_PER_USER).forEach((weaponIndex) => {
      armors.push({
        walletAddress: user.walletAddress,
        tokenId: weaponCount + (index * WEAPONS_PER_USER) + weaponIndex,
        atk: datatype.float({ min: -5, max: 5, precision: 2 }),
        perk: datatype.number({ min: 1, max: 5 }),
        class: random.arrayElement(Object.values(ItemClass).filter((itemClass) => itemClass !== ItemClass.ALL)),
        nftType: 'WEAPON',
        level: datatype.number({ min: 1, max: 99 }),
        stars: datatype.number({ min: 1, max: 5 }),
        rarity: random.arrayElement(Object.values(ItemRarity)),
      })
    })
    return armors
  }, [] as WeaponCreationAttributes[])

  console.log(`Generate ${weapons.length} items`)
  console.log(`Inserting items...`)
  await queryInterface.bulkInsert('Weapon', weapons)
  console.log(`Inserted ${weapons.length} items`)
}

export const down = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
}
