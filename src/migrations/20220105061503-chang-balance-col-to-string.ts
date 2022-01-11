import { QueryInterface, DataTypes, QueryOptions } from 'sequelize'
import '@/models/user';
import { Balance } from '@/models/balance';
import { BigNumber } from 'ethers';

export const up = async (queryInterface: QueryInterface) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */

  const allBalances = await Balance.findAll()

  const transaction = await queryInterface.sequelize.transaction()

  try {
    await queryInterface.changeColumn('Balance', 'olym', {
      type: DataTypes.STRING,
      defaultValue: '0'
    }, { transaction })

    await queryInterface.changeColumn('Balance', 'olyc', {
      type: DataTypes.STRING,
      defaultValue: '0'
    }, { transaction })

    await Promise.all(allBalances.map(async (balance) => {
      const olym: any = balance.olym
      const olyc: any = balance.olyc

      balance.set({
        olym: BigNumber.from(olym + '000000000000000000').toString() as any,
        olyc: BigNumber.from(olyc + '000000000000000000').toString() as any
      })

      await balance.save({ transaction })
    }))

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    console.log(error)
    throw error
  }
};

export const down = async (queryInterface: QueryInterface) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  const allBalances = await Balance.findAll()

  const transaction = await queryInterface.sequelize.transaction()

  const changeColumnToInteger = async (tableName: string, columnName: string, options?: QueryOptions) => {
    return queryInterface.sequelize.query(`
    ALTER TABLE "${tableName}"
      ALTER COLUMN "${columnName}" DROP DEFAULT,
      ALTER COLUMN "${columnName}" TYPE int4 using "${columnName}"::int4,
      ALTER COLUMN "${columnName}" SET DEFAULT 0;
    `, options)
  }

  try {
    await Promise.all(allBalances.map(async (balance) => {
      const olym = balance.olym
      const olyc = balance.olyc

      balance.set({
        olym: olym.div(BigNumber.from('1000000000000000000')),
        olyc: olyc.div(BigNumber.from('1000000000000000000'))
      })

      await balance.save({ transaction })
    }))

    await changeColumnToInteger('Balance', 'olym')

    await changeColumnToInteger('Balance', 'olyc')

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    console.log(error)
    throw error
  }
}
