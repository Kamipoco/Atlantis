import edge from 'edge-js'
import path from 'path'

export default class GameplayService {
  private startBattleMethod = edge.func({
    assemblyFile: path.join(__dirname, '../data/libraries/TheAtlantis.dll'),
    typeName: 'TheAtlantis.Battle',
    methodName: 'StartBattle' // This must be Func<object,Task<object>>
  });

  // TODO: input type
  public StartBattle(input?: unknown) {
    return new Promise((resolve, reject) => {
      // TODO: result type
      this.startBattleMethod(input, (error, result: unknown) => {
        if (error) {
          return reject(error)
        }

        resolve(result)
      })
    })
  }
}
