import { Dispatch } from 'redux'
import * as Bows from 'bows'
import { gameConstants } from './constants/game'
import { StoreAction, StoreState } from 'src/store/interface'
import { GameState } from 'src/reducers'
import { TraceAction } from './trace-action'
import { LocalstorageDelegate, EnvironmentDelegate } from 'src/delegates'
import { GameSaveHelper, LocationHelper, LoreHelper } from 'src/helpers'
import { playerConstants } from './constants'
import { AvailableItem } from 'src/common/interfaces'

const log = Bows('ControlAction')

export class ControlAction {
  static setActiveSection(section: string): StoreAction {
    const stateOverride: GameState = {
      activeSection: section,
    }

    return {
      type: gameConstants.UPDATE,
      payload: stateOverride,
    }
  }

  static saveProgress(): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      log('saveProgress triggered.')

      // State properties
      const state: StoreState = getState()

      const gameSave = GameSaveHelper.create(state, EnvironmentDelegate.SaveVersion)
      LocalstorageDelegate.setProgress(gameSave)
    }
  }

  static loadProgress(): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // log('loadProgress triggered.')

      // State properties
      const state: StoreState = getState()

      let gameSave = LocalstorageDelegate.getProgress()
      if (!GameSaveHelper.isValid(gameSave)) {
        await ControlAction.dispatchLogForNewGame(dispatch, state)
        return
      }

      // Check if it is an old save
      if (gameSave!.saveVersion < EnvironmentDelegate.SaveVersion) {
        try {
          gameSave = GameSaveHelper.attemptToUpgrade(gameSave!)
          await dispatch(TraceAction.addLoreLog(LoreHelper.getCustomLoreMessageByKey('SAVE_UPGRADE')))
        } catch (err) {
          log('Failed to upgrade save. err:', err)
          await dispatch(TraceAction.addLoreLog(LoreHelper.getCustomLoreMessageByKey('GAME_RESET')))
          await dispatch(TraceAction.addLoreLog('...'))
          await ControlAction.dispatchLogForNewGame(dispatch, state)
          return
        }
      }

      if (gameSave!.state.game) {
        const newGameState = GameSaveHelper.overrideGameState(state.game, gameSave!)
        await dispatch({ type: gameConstants.UPDATE, payload: newGameState })
      }

      if (gameSave!.state.player) {
        const newPlayerState = GameSaveHelper.overridePlayerState(state.player, gameSave!)
        await dispatch({ type: playerConstants.UPDATE, payload: newPlayerState })
      }

      await dispatch(TraceAction.addLoreLog(LoreHelper.getCustomLoreMessageByKey('CONTINUE_GAME')))
      await ControlAction.dispatchLogForCurrentLocation(dispatch, gameSave!.state.game.currentLocation)
    }
  }

  static setGameSpeed(clockSpeedMultiplier: number): StoreAction {
    const stateOverride: GameState = {
      clockSpeedMultiplier,
    }

    return {
      type: gameConstants.UPDATE,
      payload: stateOverride,
    }
  }

  static setDisplayLogs(displayLogs: boolean): StoreAction {
    const stateOverride: GameState = {
      displayLogs,
    }

    return {
      type: gameConstants.UPDATE,
      payload: stateOverride,
    }
  }

  static restart(): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // log('restart triggered.')
      LocalstorageDelegate.removeProgress()
    }
  }

  static applyDataCode(dataCode: string): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // State properties
      const state: StoreState = getState()

      switch (dataCode.toLowerCase()) {
        case 'reset':
          LocalstorageDelegate.removeProgress()
          return

        case 'whysoserious':
          return await ControlAction.dispatchNewGameWithGodMode(dispatch, state)
      }
    }
  }

  private static async dispatchLogForNewGame(dispatch: Dispatch<StoreAction>, state: StoreState): Promise<void> {
    await dispatch(TraceAction.addLoreLog(LoreHelper.getCustomLoreMessageByKey('NEW_GAME')))
    await ControlAction.dispatchLogForCurrentLocation(dispatch, state.game.currentLocation)
  }

  private static async dispatchLogForCurrentLocation(dispatch: Dispatch<StoreAction>, currentLocation: string | undefined): Promise<void> {
    const location = LocationHelper.getItemByKey(currentLocation)!
    await dispatch(TraceAction.addTravelLog(`You are now at <strong>${location.name}</strong>.`))
  }

  private static async dispatchNewGameWithGodMode(dispatch: Dispatch<StoreAction>, state: StoreState): Promise<void> {
    // prettier-ignore
    const consumedItems: AvailableItem[] = [
      { key: 'relic-auto-battle', quantity: 1 },
      { key: 'relic-divine-strength', quantity: 1 },
      { key: 'relic-divine-speed', quantity: 1 },
    ]
    return await ControlAction.dispatchNewGameWithAbilities(dispatch, state, consumedItems)
  }

  private static async dispatchNewGameWithAbilities(dispatch: Dispatch<StoreAction>, state: StoreState, consumedItems: AvailableItem[]): Promise<void> {
    const gameSave = GameSaveHelper.create(state, EnvironmentDelegate.SaveVersion)
    gameSave.state.player.itemUsedStats = [...gameSave.state.player.itemUsedStats!, ...consumedItems]
    LocalstorageDelegate.setProgress(gameSave)
  }
}
