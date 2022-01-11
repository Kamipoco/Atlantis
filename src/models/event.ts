import { ContractType, EventName } from "@/constants/eventname";
import { EventInstance } from "@/interfaces/event";
import { DataTypes } from "sequelize";
import { sequelize } from ".";

export const Event = sequelize.define<EventInstance>(
  'Event',
  {
    id: {
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
      unique: true
    },
    contractType: {
      type: DataTypes.ENUM({ values: Object.values(ContractType) })
    },
    contractAddress: {
      type: DataTypes.STRING,
    },
    transHash: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.ENUM({ values: Object.values(EventName) })
    },
    param: {
      type: DataTypes.JSONB
    },
    block: {
      type: DataTypes.INTEGER
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
)
