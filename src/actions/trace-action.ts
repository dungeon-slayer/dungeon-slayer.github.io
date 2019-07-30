import { Dispatch } from 'redux'
import { filter } from 'lodash'
import { StoreAction } from 'src/store/interface'
import { traceConstants } from './constants'
import { LogItem, LogType } from 'src/common/interfaces'
import { levelLores, questLores } from 'src/data'

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
      const targetLores = filter(levelLores, (item) => item.level === level)
      for (const targetLore of targetLores) {
        dispatch(TraceAction.appendLog(targetLore.message, 'lore'))
      }
    }
  }

  static loreByQuestCompletion(questKey: string): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      const targetLores = filter(questLores, (item) => item.questKey === questKey)
      for (const targetLore of targetLores) {
        dispatch(TraceAction.appendLog(targetLore.message, 'lore'))
      }
    }
  }
}
