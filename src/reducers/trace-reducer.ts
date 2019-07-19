import { take } from 'lodash'
// import * as Bows from 'bows'
import { LogItem } from 'src/common/interfaces'
import { traceConstants } from 'src/actions'
import { StoreAction } from 'src/store/interface'

// const log = Bows('traceReducer')

export interface TraceState {
  logs: LogItem[]
}

const initialState: TraceState = {
  logs: [],
}

export function trace(state = initialState, action: any): TraceState {
  switch (action.type) {
    case traceConstants.APPEND_LOG:
      return caseAppendLog(state, action)

    case traceConstants.TRUNCATE_LOGS:
      return caseTruncateLogs(state, action)

    default:
      return state
  }
}

// -- Cases

function caseAppendLog(state: TraceState, action: StoreAction): TraceState {
  const log: LogItem = (action.payload as any).log

  const newState: TraceState = {
    ...state,
  }
  newState.logs.push(log)

  return newState
}

function caseTruncateLogs(state: TraceState, action: StoreAction): TraceState {
  const size: number = (action.payload as any).size

  const newLogs = take(state.logs, size)
  const newState: TraceState = {
    ...state,
    logs: newLogs,
  }
  return newState
}
