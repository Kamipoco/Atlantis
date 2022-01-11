import { QueryInterface, Sequelize } from 'sequelize'
import replaceEnum from 'sequelize-replace-enum-postgres'

export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */

  await replaceEnum({
    tableName: 'Event',
    columnName: 'name',
    newValues: [
      "DepositToken",
      "Deposit",
      "WithdrawToken",
      "Withdraw",
    ],
    queryInterface
  })

  console.log('Current enum: ["DepositToken","Deposit","WithdrawToken","Withdraw"]')

  const transaction = await queryInterface.sequelize.transaction()

  try {
    await queryInterface.sequelize.query(`UPDATE "${'Event'}" SET name = 'DepositToken'::"enum_Event_name" WHERE name = 'Deposit'::"enum_Event_name"`, {
      transaction
    })
    console.log('Replaced Deposit with DepositToken')

    await queryInterface.sequelize.query(`UPDATE "${'Event'}" SET name = 'WithdrawToken'::"enum_Event_name" WHERE name = 'Withdraw'::"enum_Event_name"`, {
      transaction
    })
    console.log('Replaced Withdraw with WithdrawToken')

    await transaction.commit()
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    throw error
  }

  const res = await replaceEnum({
    tableName: 'Event',
    columnName: 'name',
    newValues: [
      "DepositToken",
      "DepositNFT",
      "WithdrawToken",
      "WithdrawNFT",
    ],
    queryInterface
  })
  console.log('Current enum: ["DepositToken","DepositNFT","WithdrawToken","WithdrawNFT"]')

  return res
}

export const down = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('user');
   */

  await replaceEnum({
    tableName: 'Event',
    columnName: 'name',
    newValues: [
      "DepositToken",
      "DepositNFT",
      "WithdrawToken",
      "WithdrawNFT",
      "Deposit",
      "Withdraw"
    ],
    queryInterface
  })
  console.log('Current enum: ["DepositToken","DepositNFT","WithdrawToken","WithdrawNFT","Deposit","Withdraw"]')

  const transaction = await queryInterface.sequelize.transaction()

  try {
    await queryInterface.sequelize.query(`UPDATE "${'Event'}" SET name = 'Deposit'::"enum_Event_name" WHERE name = 'DepositNFT'::"enum_Event_name" OR name = 'DepositToken'::"enum_Event_name"`, {
      transaction
    })
    console.log('Replaced DepositToken and DepositNFT with Deposit')

    await queryInterface.sequelize.query(`UPDATE "${'Event'}" SET name = 'Withdraw'::"enum_Event_name" WHERE name = 'WithdrawNFT'::"enum_Event_name" OR name = 'WithdrawToken'::"enum_Event_name"`, {
      transaction
    })
    console.log('Replaced WithdrawToken and WithdrawNFT with Deposit')

    await transaction.commit()
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    throw error
  }

  const result = await replaceEnum({
    tableName: 'Event',
    columnName: 'name',
    newValues: [
      "Deposit",
      "Withdraw",
    ],
    queryInterface
  })
  console.log('Current enum: ["Deposit","Withdraw"]')
  return result
}
