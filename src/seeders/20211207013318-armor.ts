import { ArmorCreationAttributes } from '@/interfaces/armor'
import { Armor } from '@/models/armor'
import { User } from '@/models/user'
import { range } from 'lodash'
import { QueryInterface, Sequelize } from 'sequelize'
import { datatype, random } from 'faker'
import { ItemClass, ItemRarity } from '@/constants/items'

const ARMORS_PER_USER = 5

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
  const armorCount = await Armor.count()

  const armors: ArmorCreationAttributes[] = users.reduce((armors, user, index) => {
    range(ARMORS_PER_USER).forEach((armorIndex) => {
      armors.push({
        walletAddress: user.walletAddress,
        tokenId: armorCount + (index * ARMORS_PER_USER) + armorIndex,
        hp: datatype.float({ min: -5, max: 5, precision: 2 }),
        perk: datatype.number({ min: 1, max: 5 }),
        class: random.arrayElement(Object.values(ItemClass).filter((itemClass) => itemClass !== ItemClass.ALL)),
        nftType: 'ARMOR',
        level: datatype.number({ min: 1, max: 99 }),
        stars: datatype.number({ min: 1, max: 5 }),
        rarity: random.arrayElement(Object.values(ItemRarity)),
      })
    })
    return armors
  }, [] as ArmorCreationAttributes[])

  console.log(`Generate ${armors.length} items`)
  console.log(`Inserting items...`)
  await queryInterface.bulkInsert('Armor', armors)
  console.log(`Inserted ${armors.length} items`)
}

export const down = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
}
