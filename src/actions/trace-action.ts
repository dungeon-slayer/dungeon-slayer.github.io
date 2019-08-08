import { Dispatch } from 'redux'
import { StoreAction } from 'src/store/interface'
import { traceConstants } from './constants'
import { LogItem, LogType } from 'src/common/interfaces'
import { LoreHelper } from 'src/helpers'

export class TraceAction {
  static appendBattleLog(message: string): StoreAction {
    return TraceAction.appendLog(message, 'battle')
  }

  static appendLoreLog(message: string): StoreAction {
    return TraceAction.appendLog(message, 'lore')
  }

  static appendTravelLog(message: string): StoreAction {
    return TraceAction.appendLog(message, 'travel')
  }

  static appendConsumelLog(message: string): StoreAction {
    return TraceAction.appendLog(message, 'consume')
  }

  static appendShoplLog(message: string): StoreAction {
    return TraceAction.appendLog(message, 'shop')
  }

  static appendLog(message: string, type: LogType = 'normal'): StoreAction {
    const log: LogItem = {
      timestamp: Date.now(),
      type,
      message,
    }

    return {
      type: traceConstants.APPEND_LOG,
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
        dispatch(TraceAction.appendLoreLog(targetLore.message))
      }
    }
  }

  static loreByQuestCompletion(questKey: string): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      const targetLores = LoreHelper.getQuestLoresByKey(questKey)
      for (const targetLore of targetLores) {
        dispatch(TraceAction.appendLoreLog(targetLore.message))
      }
    }
  }
}
