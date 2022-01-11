import { SchedulerInstance } from "@/interfaces/scheduler";
import { DataTypes } from "sequelize";
import { sequelize } from ".";

export const Scheduler = sequelize.define<SchedulerInstance>(
  'Scheduler',
  {
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
      unique: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
)
