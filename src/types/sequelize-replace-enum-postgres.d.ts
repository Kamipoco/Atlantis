/// <reference types="sequelize" />

declare module 'sequelize-replace-enum-postgres' {
  export default function (args: {
    tableName: string
    columnName: string
    defaultValue?: any
    newValues: string[]
    queryInterface: QueryInterface
    enumName?: string
  })
}