import { AnyAction } from 'redux'
import { progressConstants } from './constants/progress'

export class ProgressAction {
  static idle(): AnyAction {
    return { type: progressConstants.IDLE }
  }

  static confirm(): AnyAction {
    return { type: progressConstants.CONFIRM }
  }

  static loading(portion = 0): AnyAction {
    return {
      type: progressConstants.LOADING,
      payload: {
        portion,
      },
    }
  }

  static success(): AnyAction {
    return { type: progressConstants.SUCCESS }
  }

  static failure(error: any): AnyAction {
    return {
      type: progressConstants.FAILURE,
      error: true,
      payload: error,
    }
  }

  /**
   * Custom progress type must starts with prefix of 'PROGRESS_'.
   */
  static customType(type: string): AnyAction {
    return { type }
  }
}
