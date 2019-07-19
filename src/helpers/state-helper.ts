import { find } from 'lodash'
// import * as Bows from 'bows'
import { GameState } from 'src/reducers'
import { CharacterItem } from 'src/common/interfaces'

// const log = Bows('StateHelper')

export class StateHelper {
  static getMobById(gameState: GameState, mobId: string): CharacterItem | undefined {
    if (!gameState.mobs) {
      return undefined
    }

    const targetMob = find(gameState.mobs, (mob) => mob.id === mobId)
    return targetMob
  }
}
