import { Dispatch } from 'redux'
import { map } from 'lodash'
import { StoreAction } from 'src/store/interface'
import { traceConstants } from './constants'
import { LogItem, LogType, PossessionItem } from 'src/common/interfaces'
import { LoreHelper } from 'src/helpers'

export class TraceAction {
  static addBattleLog(message: string): StoreAction {
    return TraceAction.addLog(message, 'battle')
  }

  static addLoreLog(message: string): StoreAction {
    return TraceAction.addLog(message, 'lore')
  }

  static addTravelLog(message: string): StoreAction {
    return TraceAction.addLog(message, 'travel')
  }

  static addConsumelLog(message: string): StoreAction {
    return TraceAction.addLog(message, 'consume')
  }

  static addShoplLog(message: string): StoreAction {
    return TraceAction.addLog(message, 'shop')
  }

  static addObtainDropsLog(possessions: PossessionItem[]): StoreAction {
    const dropNames = map(possessions, (drop) => `<strong>${drop.name}</strong>`)
    const message = `You obtained ${dropNames.join(', ')}.`
    return TraceAction.addLog(message)
  }

  static addLog(message: string, type: LogType = 'normal'): StoreAction {
    const log: LogItem = {
      timestamp: Date.now(),
      type,
      message,
    }

    return {
      type: traceConstants.ADD_LOG,
      payload: {
        log,
      },
    }
  }

  static truncateLogs(size = 100): StoreAction {
    return {
      type: traceConstants.TRUNCATE_LOGS,
      payload: {
        size,
      },
    }
  }

  static loreByLevelUp(level: number): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      const targetLores = LoreHelper.getLevelLoresByKey(level.toString())
      for (const targetLore of targetLores) {
        dispatch(TraceAction.addLoreLog(targetLore.message))
      }
    }
  }

  static loreByQuestCompletion(questKey: string): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      const targetLores = LoreHelper.getQuestLoresByKey(questKey)
      for (const targetLore of targetLores) {
        dispatch(TraceAction.addLoreLog(targetLore.message))
      }
    }
  }
}
