// import * as Bows from 'bows'
import { gameConstants } from 'src/actions'
import { StoreAction } from 'src/store/interface'
import { CharacterItem } from 'src/common/interfaces'
import { EnvironmentDelegate } from 'src/delegates'

// const log = Bows('gameReducer')

export interface GameState {
  isGameRunning?: boolean
  activeSection?: string
  mobs?: CharacterItem[]
  nextMobGenerateTs?: number
  clockSpeedMultiplier?: number
  currentLocation?: string
  displayLogs?: boolean
  closedAccordionKeys?: string[]
}

const initialState: GameState = {
  isGameRunning: true,
  activeSection: 'location',
  mobs: [],
  nextMobGenerateTs: undefined,
  clockSpeedMultiplier: EnvironmentDelegate.DefaultGameSpeed,
  currentLocation: 'abbotsford-cave',
  displayLogs: true,
  closedAccordionKeys: [],
}

export function game(state = initialState, action: any): GameState {
  switch (action.type) {
    case gameConstants.UPDATE:
      return caseUpdate(state, action)

    case gameConstants.APPEND_MOB:
      return caseAppendMob(state, action)

    default:
      return state
  }
}

// -- Cases

function caseUpdate(state: GameState, action: StoreAction): GameState {
  const payload = action.payload!

  const newState: GameState = {
    ...state,
    ...payload,
  }
  return newState
}

function caseAppendMob(state: GameState, action: StoreAction): GameState {
  const mob: CharacterItem = (action.payload as any).mob
  const nextMobGenerateTs: number = (action.payload as any).nextMobGenerateTs

  const newState: GameState = {
    ...state,
  }
  newState.mobs!.push(mob)
  newState.nextMobGenerateTs = nextMobGenerateTs

  return newState
}
