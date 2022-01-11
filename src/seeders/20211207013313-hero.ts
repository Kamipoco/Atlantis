import { QueryInterface, Sequelize } from 'sequelize'
import { User } from '@/models/user'
import { Hero } from '@/models/hero'
import { range } from 'lodash'
import { HeroCreationAttributes } from '@/interfaces/hero'
import { datatype, random, internet } from 'faker'
import { ItemRarity, ItemClass } from '@/constants/items'
import { HERO_RACE } from '@/constants/hero'

const HEROES_PER_USER = 5

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
  const heroCount = await Hero.count()

  const heroes: HeroCreationAttributes[] = users.reduce((heroes, user, index) => {
    range(HEROES_PER_USER).forEach((heroIndex) => {
      heroes.push({
        walletAddress: user.walletAddress,
        tokenId: heroCount + (index * HEROES_PER_USER) + heroIndex,
        hp: datatype.float({ min: -5, max: 5, precision: 2 }),
        atk: datatype.float({ min: -5, max: 5, precision: 2 }),
        pdef: datatype.float({ min: -5, max: 5, precision: 2 }),
        level: datatype.number({ min: 1, max: 99 }),
        stars: datatype.number({ min: 1, max: 5 }),
        rarity: random.arrayElement(Object.values(ItemRarity)),
        nftType: 'HERO',
        class: random.arrayElement(Object.values(ItemClass).filter((itemClass) => itemClass !== ItemClass.ALL)),
        colors: range(6).map(() => internet.color()),
        race: random.arrayElement(Object.values(HERO_RACE))
      })
    })
    return heroes
  }, [] as HeroCreationAttributes[])
  console.log(`Generate ${heroes.length} items`)
  console.log(`Inserting items...`)
  await queryInterface.bulkInsert('Hero', heroes)
  console.log(`Inserted ${heroes.length} items`)
}

export const down = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
}
