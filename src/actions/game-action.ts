import { Dispatch } from 'redux'
import { filter, cloneDeep } from 'lodash'
// import * as Bows from 'bows'
import { gameConstants } from './constants/game'
import { StoreAction, StoreState } from 'src/store/interface'
import { GameState } from 'src/reducers'
import { MobHelper, PlayerHelper, DungeonHelper, BattleHelper } from 'src/helpers'
import { GameHelper } from 'src/helpers/game-helper'
import { CharacterItem, SaveProgressItem } from 'src/common/interfaces'
import { DungeonItem } from 'src/data'
import { TraceAction } from './trace-action'
import { LocalstorageDelegate, EnvironmentDelegate } from 'src/delegates'
import { playerConstants } from './constants'

const version = require('../../package.json').version // tslint:disable-line
// const log = Bows('GameAction')

export class GameAction {
  static setActiveSection(section: string): StoreAction {
    const stateOverride: GameState = {
      activeSection: section,
    }

    return {
      type: gameConstants.UPDATE,
      payload: stateOverride,
    }
  }

  static appendRandomMob(): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // State properties
      const state: StoreState = getState()

      if (!state.game.isGameRunning) {
        // log('Game is currently paused. Postpone.')
        return
      }

      if (state.game.mobs!.length >= PlayerHelper.getMobQueueSize(state.player.character!.currentLevel)) {
        // log('Mob queue size limit reached. Postpone.')
        return
      }

      if (state.game.nextMobGenerateTs && state.game.nextMobGenerateTs > Date.now()) {
        // Not ready to generate yet
        return
      }

      const dungeonItem = DungeonHelper.getItemByKey(state.game.currentLocation)
      if (!dungeonItem) {
        // Not currently at a dungeon
        return
      }

      dispatch({
        type: gameConstants.APPEND_MOB,
        payload: {
          mob: MobHelper.getRandomMob(dungeonItem),
          nextMobGenerateTs: GameHelper.getNextMobGenerateTimestamp(state.game, EnvironmentDelegate.MobGenerateIntervalMs),
        },
      })
    }
  }

  static removeMob(mobId: string): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // State properties
      const state: StoreState = getState()
      const existingMobs = state.game.mobs

      let newMobs: CharacterItem[] = []
      if (existingMobs) {
        newMobs = filter(existingMobs, (mob) => mob.id !== mobId)
      }

      const payload: GameState = {
        mobs: newMobs,
      }

      dispatch({
        type: gameConstants.UPDATE,
        payload,
      })
    }
  }

  static travelTo(dungeon: DungeonItem): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // log('travelTo triggered.')

      // State properties
      const state: StoreState = getState()

      if (state.game.currentLocation === dungeon.key) {
        // log('Already at this location.')
        return
      }

      if (state.player.character!.currentLevel < dungeon.levelRequired) {
        // log('Has not met level requirement.')
        return
      }

      if (BattleHelper.isEngaging(state.battle)) {
        await dispatch(TraceAction.appendLog(`You cannot travel during a battle.`))
        return
      }

      await dispatch(TraceAction.appendLog(`You are now at <strong>${dungeon.name}</strong>.`))

      const payload: GameState = {
        currentLocation: dungeon.key,
        mobs: [],
        nextMobGenerateTs: Date.now(),
      }
      dispatch({
        type: gameConstants.UPDATE,
        payload,
      })
    }
  }

  static saveProgress(): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // log('saveProgress triggered.')

      // State properties
      const state: StoreState = getState()

      const data: SaveProgressItem = {
        appVersion: version,
        saveVersion: 1,
        saveTs: Date.now(),
        state: {
          game: state.game,
          player: state.player,
        },
      }
      LocalstorageDelegate.setProgress(data)
    }
  }

  static loadProgress(): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // log('loadProgress triggered.')

      // State properties
      const state: StoreState = getState()

      const saveProgress = LocalstorageDelegate.getProgress()
      if (!saveProgress || !saveProgress.state) {
        const initDungeon = DungeonHelper.getItemByKey(state.game.currentLocation)!
        await dispatch(TraceAction.appendLog('Many heros ventured into the depth of unknown seeking for legendary artifacts but none have succeeded. You consider yourself ready for the challenge and begin your adventure.'))
        await dispatch(TraceAction.appendLog(`You are now at <strong>${initDungeon.name}</strong>.`))
        return
      }

      if (saveProgress.state.game) {
        let newGameState = cloneDeep(state.game)
        newGameState = {
          ...newGameState,
          ...saveProgress.state.game,
        }
        await dispatch({ type: gameConstants.UPDATE, payload: newGameState })
      }

      if (saveProgress.state.player) {
        let newPlayerState = cloneDeep(state.player)
        newPlayerState = {
          ...newPlayerState,
          ...saveProgress.state.player,
        }
        await dispatch({ type: playerConstants.UPDATE, payload: newPlayerState })
      }

      const loadedDungeon = DungeonHelper.getItemByKey(saveProgress.state.game.currentLocation)!
      await dispatch(TraceAction.appendLog(`After a long rest, you slowly open you eyes and continue on your adventure`))
      await dispatch(TraceAction.appendLog(`You are now at <strong>${loadedDungeon.name}</strong>.`))
    }
  }

  static restart(): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // log('restart triggered.')

      LocalstorageDelegate.removeProgress()
    }
  }
}
