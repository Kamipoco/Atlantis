import { QueryInterface, Sequelize, DataTypes } from 'sequelize'

export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */
  await queryInterface.createTable('Scheduler', {
    id: {
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
      unique: true
    },
    lastEventTimeStamp: {
      type: DataTypes.BIGINT,
      unique: true
    },
    timeStamp: {
      type: DataTypes.BIGINT,
      unique: true,
    }
  });

  await queryInterface.sequelize.query(`ALTER TABLE "Scheduler" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();`);
}

export const down = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('user');
   */
  return queryInterface.dropTable('Scheduler')
}
