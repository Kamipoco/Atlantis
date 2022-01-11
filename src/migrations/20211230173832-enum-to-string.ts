import { QueryInterface, DataTypes } from 'sequelize'

export const up = async (queryInterface: QueryInterface) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */

  const transaction = await queryInterface.sequelize.transaction()

  try {
    await queryInterface.changeColumn('GenesisHero', 'rarity', {
      type: DataTypes.STRING(),
    }, {
      transaction
    })

    await queryInterface.changeColumn('GenesisHero', 'class', {
      type: DataTypes.STRING()
    }, {
      transaction
    })

    await queryInterface.changeColumn('Event', 'contractType', {
      type: DataTypes.STRING()
    }, {
      transaction
    })

    await queryInterface.changeColumn('Event', 'name', {
      type: DataTypes.STRING()
    }, {
      transaction
    })

    await queryInterface.changeColumn('Armor', 'rarity', {
      type: DataTypes.STRING()
    }, {
      transaction
    })

    await queryInterface.changeColumn('Armor', 'nftType', {
      type: DataTypes.STRING()
    }, {
      transaction
    })

    await queryInterface.changeColumn('Armor', 'class', {
      type: DataTypes.STRING()
    }, {
      transaction
    })

    await queryInterface.changeColumn('Weapon', 'rarity', {
      type: DataTypes.STRING()
    }, {
      transaction
    })

    await queryInterface.changeColumn('Weapon', 'nftType', {
      type: DataTypes.STRING()
    }, {
      transaction
    })

    await queryInterface.changeColumn('Weapon', 'class', {
      type: DataTypes.STRING()
    }, {
      transaction
    })

    await queryInterface.changeColumn('Hero', 'rarity', {
      type: DataTypes.STRING()
    }, {
      transaction
    })

    await queryInterface.changeColumn('Hero', 'nftType', {
      type: DataTypes.STRING()
    }, {
      transaction
    })

    await queryInterface.changeColumn('Hero', 'class', {
      type: DataTypes.STRING()
    }, {
      transaction
    })

    await transaction.commit()
  } catch (error) {
    console.log(error)
    await transaction.rollback()
  }
}

export const down = async (queryInterface: QueryInterface) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  const changeColumnToEnum = async (tableName: string, columnName: string, enumName: string) => {
    return queryInterface.sequelize.query(`ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" TYPE "${enumName}" using "${columnName}"::"${enumName}"`)
  }

  const transaction = await queryInterface.sequelize.transaction()

  try {
    await changeColumnToEnum('GenesisHero', 'class', 'enum_GenesisHero_class')
    await changeColumnToEnum('GenesisHero', 'rarity', 'enum_GenesisHero_rarity')

    await changeColumnToEnum('Event', 'contractType', 'enum_Event_contractType')
    await changeColumnToEnum('Event', 'name', 'enum_Event_name')

    await changeColumnToEnum('Armor', 'class', 'enum_Armor_class')
    await changeColumnToEnum('Armor', 'nftType', 'enum_Armor_nftType')
    await changeColumnToEnum('Armor', 'rarity', 'enum_Armor_rarity')

    await changeColumnToEnum('Hero', 'class', 'enum_Hero_class')
    await changeColumnToEnum('Hero', 'nftType', 'enum_Hero_nftType')
    await changeColumnToEnum('Hero', 'rarity', 'enum_Hero_rarity')

    await changeColumnToEnum('Weapon', 'class', 'enum_Weapon_class')
    await changeColumnToEnum('Weapon', 'nftType', 'enum_Weapon_nftType')
    await changeColumnToEnum('Weapon', 'rarity', 'enum_Weapon_rarity')

    await transaction.commit()
  } catch (error) {
    console.log(error)
    await transaction.rollback()
  }
}

