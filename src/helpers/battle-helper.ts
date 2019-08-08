import { floor } from 'lodash'
import { CharacterItem, DamageDataItem } from 'src/common/interfaces'
import { BattleState } from 'src/reducers'
import { CharacterHelper } from './character-helper'
import { RandomHelper } from './random-helper'

export class BattleHelper {
  static getDamageData(attacker: CharacterItem, defender: CharacterItem): DamageDataItem {
    const output: DamageDataItem = { damageDealt: 0, isCriticalHit: false }

    // Attack point
    let attackPoint = attacker.attack * 4 * CharacterHelper.getAttackMultiplier(attacker)
    if (attackPoint > 0) {
      const attackerCriticalHitRate = CharacterHelper.getBaseCriticalHitRate(attacker)
      const attackerCriticalHitMultiplier = CharacterHelper.getBaseCriticalHitMultiplier(attacker)
      if (RandomHelper.takeChance(attackerCriticalHitRate)) {
        attackPoint = attackPoint * attackerCriticalHitMultiplier
        output.isCriticalHit = true
      }
    }

    // Defense point
    const defensePoint = defender.defense * 2 * CharacterHelper.getDefenseMultiplier(defender)

    const damagePoint = floor(attackPoint - defensePoint)
    output.damageDealt = damagePoint < 0 ? 0 : damagePoint

    return output
  }

  static isEngaging(battle: BattleState): boolean {
    return !!battle.startAt
  }
}
