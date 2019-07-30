import { cloneDeep } from 'lodash'
import { StoreState } from 'src/store/interface'
import { GameSaveItem } from 'src/common/interfaces'
import { GameState, PlayerState } from 'src/reducers'

const version = require('../../package.json').version // tslint:disable-line

export class GameSaveHelper {
  static create(state: StoreState, saveVersion: number): GameSaveItem {
    const gameSave: GameSaveItem = {
      appVersion: version,
      saveVersion,
      saveTs: Date.now(),
      state: {
        game: state.game,
        player: state.player,
      },
    }
    return gameSave
  }

  static isValid(gameSave: GameSaveItem | undefined): boolean {
    return !!(gameSave && gameSave.state)
  }

  static overrideGameState(gameState: GameState, gameSave: GameSaveItem): GameState {
    let newGameState = cloneDeep(gameState)
    newGameState = {
      ...newGameState,
      ...gameSave.state.game,
    }
    return newGameState
  }

  static overridePlayerState(playerState: PlayerState, gameSave: GameSaveItem): PlayerState {
    let newPlayerState = cloneDeep(playerState)
    newPlayerState = {
      ...newPlayerState,
      ...gameSave.state.player,
    }
    return newPlayerState
  }

  static attemptToUpgrade(gameSave: GameSaveItem): GameSaveItem {
    if (!gameSave.saveVersion) {
      throw new Error('Unknown save version.')
    }

    // // Upgrade from 1 to 2
    // if (gameSave.saveVersion === 1) {
    //   gameSave.saveVersion = 2
    //   gameSave.state.player.gold = 0
    //   gameSave.state.player.availableDrops = []
    //   gameSave.state.player.mobKillStats = []
    //   gameSave.state.player.itemUsedStats = []
    //   gameSave.state.player.questDeliveredStats = []
    // }

    // return gameSave

    throw new Error('Legacy save version.')
  }
}
