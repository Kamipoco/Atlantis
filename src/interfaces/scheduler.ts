import { Model, Optional } from "sequelize";

export interface SchedulerAttributes {
  id: string,
  lastEventTimeStamp: number,
  timeStamp: number,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SchedulerCreationAttributes extends Optional<SchedulerAttributes, "id"> { }

export interface SchedulerInstance extends Model<SchedulerAttributes, SchedulerCreationAttributes>,
  SchedulerAttributes {

}
