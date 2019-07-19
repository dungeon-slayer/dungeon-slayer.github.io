import { floor } from 'lodash'
import { GameState } from 'src/reducers'

export class GameHelper {
  static getNextMobGenerateTimestamp(game: GameState, standardMobGenerateIntervalMs: number): number {
    const baseTs = game.nextMobGenerateTs ? game.nextMobGenerateTs : Date.now()
    const baseModifier = game.clockSpeedModifier ? game.clockSpeedModifier : 1
    const incrementMs = floor(standardMobGenerateIntervalMs / baseModifier)
    return baseTs + incrementMs
  }

  static getTickIntervalMs(game: GameState, standardTickIntervalMs: number): number {
    const baseModifier = game.clockSpeedModifier ? game.clockSpeedModifier : 1
    const ms = floor(standardTickIntervalMs / baseModifier)
    return ms <= 0 ? 1 : ms
  }
}
