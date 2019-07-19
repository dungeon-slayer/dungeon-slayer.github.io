import { SvgIconProps } from '@material-ui/core/SvgIcon'
import { GameState, PlayerState } from 'src/reducers'

export interface CharacterItem {
  key: string
  id: string
  createdAt: number // Timestamp in ms

  currentLevel: number
  maxHp: number
  currentHp: number
  attack: number
  defense: number
  chargeTimeMs: number
  nextTurnTs: number | undefined // Timestamp in ms
  currentExp: number
  rewardExp: number
}

export interface LogItem {
  timestamp: number
  message: string
}

export interface InventoryItem {
  consumableKey: string
  quantity: number
}

export type IconComponent = React.ComponentType<SvgIconProps>

export interface SaveProgressItem {
  appVersion: string
  saveVersion: number
  saveTs: number
  state: {
    game: GameState
    player: PlayerState
  }
}
