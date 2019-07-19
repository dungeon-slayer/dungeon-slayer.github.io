// import * as Bows from 'bows'
import { progressConstants } from '../actions'

// const log = Bows('progressReducer')

export const progressHelper = {
  isProgressActionType: (type: string): boolean => {
    return type.indexOf('PROGRESS_') === 0
  },
}

export interface ProgressState {
  type: string
  portion?: number
  error?: object
}

const initialState: ProgressState = {
  type: progressConstants.IDLE,
}

export function progress(state = initialState, action: any): ProgressState {
  switch (action.type) {
    case progressConstants.IDLE:
      return { type: progressConstants.IDLE }

    case progressConstants.CONFIRM:
      return { type: progressConstants.CONFIRM }

    case progressConstants.LOADING:
      return { type: progressConstants.LOADING, portion: action.payload.portion }

    case progressConstants.SUCCESS:
      return { type: progressConstants.SUCCESS }

    case progressConstants.FAILURE:
      return { type: progressConstants.FAILURE, error: action.payload }

    default:
      break
  }

  // Support for custom progress type
  if (action) {
    if (progressHelper.isProgressActionType(action.type)) {
      return {
        ...state,
        type: action.type,
      }
    }
  }

  // Fallback
  return state
}
