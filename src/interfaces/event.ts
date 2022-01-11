import { ContractType, EventName } from "@/constants/eventname";
import { Model, Optional } from "sequelize";

export interface EventAttributes {
  id: number,
  contractType?: ContractType,
  contractAddress?: string,
  transHash: string,
  name?: EventName,
  param?: object,
  block?: number
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EventCreationAttributes extends Optional<EventAttributes, "id"> { }

export interface EventInstance extends Model<EventAttributes, EventCreationAttributes>,
  EventAttributes {

}
