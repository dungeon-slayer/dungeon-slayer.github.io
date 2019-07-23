// import * as Bows from 'bows'
import { playerConstants, battleConstants } from 'src/actions'
import { StoreAction } from 'src/store/interface'
import { PlayerHelper, RandomHelper } from 'src/helpers'
import { CharacterItem, InventoryItem } from 'src/common/interfaces'

// const log = Bows('playerReducer')

export interface PlayerState {
  character?: CharacterItem
  availableAbilities?: string[]
  activeAbilities?: string[]
  inventoryItems?: InventoryItem[]
}

const initialState: PlayerState = {
  character: {
    key: 'player',
    id: RandomHelper.generateId('p'),
    createdAt: Date.now(),
    currentLevel: 1,
    maxHp: PlayerHelper.getHp(1),
    currentHp: PlayerHelper.getHp(1),
    attack: PlayerHelper.getAttack(1),
    defense: PlayerHelper.getDefense(1),
    chargeTimeMs: PlayerHelper.getChargeTimeMs(),
    nextTurnTs: undefined,
    currentExp: 0,
    rewardExp: 0,
  },
  availableAbilities: ['auto-battle'],
  activeAbilities: [],
  inventoryItems: [
    {
      consumableKey: 'potion',
      quantity: 10,
    },
  ],
}

export function player(state = initialState, action: any): PlayerState {
  switch (action.type) {
    case playerConstants.UPDATE:
      return caseUpdate(state, action)

    case playerConstants.LEVEL_UP:
      return caseLevelUp(state, action)

    case battleConstants.CLOSURE:
      return caseBattleClosure(state, action)

    default:
      return state
  }
}

// -- Cases

function caseUpdate(state: PlayerState, action: StoreAction): PlayerState {
  const payload = action.payload!

  const newState: PlayerState = {
    ...state,
    ...payload,
  }
  return newState
}

function caseLevelUp(state: PlayerState, action: StoreAction): PlayerState {
  const newState: PlayerState = { ...state }

  newState.character!.currentExp -= PlayerHelper.getExpRequiredToLevelUp(newState.character!.currentLevel)
  newState.character!.currentLevel += 1
  newState.character!.maxHp = PlayerHelper.getHp(newState.character!.currentLevel)
  newState.character!.currentHp = PlayerHelper.getHp(newState.character!.currentLevel)
  newState.character!.attack = PlayerHelper.getAttack(newState.character!.currentLevel)
  newState.character!.defense = PlayerHelper.getDefense(newState.character!.currentLevel)

  return newState
}

function caseBattleClosure(state: PlayerState, action: StoreAction): PlayerState {
  const newState: PlayerState = { ...state }

  newState.character!.nextTurnTs = undefined

  return newState
}
