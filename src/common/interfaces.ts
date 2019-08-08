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
  activeAbilities?: string[]
}

export type LogType = 'normal' | 'battle' | 'lore' | 'travel' | 'consume' | 'shop'

export interface LogItem {
  timestamp: number
  type: LogType
  message: string
}

export interface AvailableItem {
  key: string
  quantity: number
}

export type IconComponent = React.ComponentType<SvgIconProps>

export interface GameSaveItem {
  appVersion: string
  saveVersion: number
  saveTs: number
  state: {
    game: GameState
    player: PlayerState
  }
}

export interface PriceMultiplierItem {
  key: string
  multiplier: number
}

export interface QuestItem {
  key: string
  name: string
  conversation: string
  requestItems: AvailableItem[]
  rewardItems: AvailableItem[]
  prerequisiteQuests: string[]
}

export interface SelectItem {
  value: string
  label: string
}

export interface MobAppearanceItem {
  key: string
  appearanceRate: number // Recommend 0.1 and 1
}

export interface DungeonTemplateItem {
  mobAppearances: MobAppearanceItem[]
  mobLevelBase: number
  mobLevelHalfRange: number
  mobLevelSkew: number // 1 for standard, 0.5 for skew to right, 2 for skew to left
}

export interface CharacterEffectItem {
  hpModifier?: number
  attackMultiplier?: number
  defenseMultiplier?: number
  evasionMultiplier?: number
  chargeTimeMultiplier?: number
  experienceMultiplier?: number
  gainAbilities?: string[]
}

export interface DamageDataItem {
  damageDealt: number
  isCriticalHit: boolean
}
