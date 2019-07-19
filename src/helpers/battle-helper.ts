import { floor } from 'lodash'
import { CharacterItem } from 'src/common/interfaces'
import { GameState, BattleState } from 'src/reducers'

export class BattleHelper {
  static getNextTurnTimestamp(character: CharacterItem, game: GameState): number {
    const baseTs = character.nextTurnTs ? character.nextTurnTs : Date.now()
    const baseModifier = game.clockSpeedModifier ? game.clockSpeedModifier : 1
    const incrementMs = floor(character.chargeTimeMs / baseModifier)
    return baseTs + incrementMs
  }

  static getDamageValue(attacker: CharacterItem, defender: CharacterItem): number {
    const val = attacker.attack * 4 - defender.defense * 2
    return val < 0 ? 0 : val
  }

  static isEngaging(battle: BattleState): boolean {
    return !!battle.startAt
  }
}
