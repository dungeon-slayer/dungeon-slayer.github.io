import { floor } from 'lodash'
import { CharacterItem } from 'src/common/interfaces'
import { BattleState } from 'src/reducers'
import { CharacterHelper } from './character-helper'

export class BattleHelper {
  static getDamageValue(attacker: CharacterItem, defender: CharacterItem): number {
    const attackPoint = attacker.attack * 4 * CharacterHelper.getAttackMultiplier(attacker)
    const defensePoint = defender.defense * 2
    const val = floor(attackPoint - defensePoint)
    return val < 0 ? 0 : val
  }

  static isEngaging(battle: BattleState): boolean {
    return !!battle.startAt
  }
}
