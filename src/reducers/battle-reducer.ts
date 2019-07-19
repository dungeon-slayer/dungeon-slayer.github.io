// import * as Bows from 'bows'
import { battleConstants } from 'src/actions'
import { StoreAction } from 'src/store/interface'
import { CharacterItem } from 'src/common/interfaces'

// const log = Bows('battleReducer')

export interface BattleState {
  startAt?: number // Timestamp in ms
  targetMob?: CharacterItem
}

const initialState: BattleState = {
  startAt: undefined,
  targetMob: undefined,
}

export function battle(state = initialState, action: any): BattleState {
  switch (action.type) {
    case battleConstants.UPDATE:
      return caseUpdate(state, action)

    case battleConstants.RESET:
      return caseReset(state, action)

    case battleConstants.CLOSURE:
      return caseClosure(state, action)

    default:
      return state
  }
}

// -- Cases

function caseUpdate(state: BattleState, action: StoreAction): BattleState {
  const payload = action.payload!

  const newState: BattleState = {
    ...state,
    ...payload,
  }
  return newState
}

function caseReset(state: BattleState, action: StoreAction): BattleState {
  const newState: BattleState = {
    ...initialState,
  }
  return newState
}

function caseClosure(state: BattleState, action: StoreAction): BattleState {
  const newState: BattleState = {
    ...state,
    startAt: undefined,
  }
  return newState
}
