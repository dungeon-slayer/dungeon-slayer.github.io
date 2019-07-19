import { StoreAction } from 'src/store/interface'
import { traceConstants } from './constants'
import { LogItem } from 'src/common/interfaces'

export class TraceAction {
  static appendLog(message: string): StoreAction {
    const log: LogItem = {
      timestamp: Date.now(),
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
}
