import { floor } from 'lodash'
import { GameState } from 'src/reducers'

export class GameHelper {
  static getNextMobGenerateTimestamp(game: GameState, standardMobGenerateIntervalMs: number): number {
    const baseTs = game.nextMobGenerateTs ? game.nextMobGenerateTs : Date.now()
    const baseMultiplier = game.clockSpeedMultiplier ? game.clockSpeedMultiplier : 1
    const incrementMs = floor(standardMobGenerateIntervalMs / baseMultiplier)
    return baseTs + incrementMs
  }

  static getTickIntervalMs(game: GameState, standardTickIntervalMs: number): number {
    const baseMultiplier = game.clockSpeedMultiplier ? game.clockSpeedMultiplier : 1
    const ms = floor(standardTickIntervalMs / baseMultiplier)
    return ms <= 0 ? 1 : ms
  }
}
