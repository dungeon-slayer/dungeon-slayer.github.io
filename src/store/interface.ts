import { AnyAction } from 'redux'
import { ProgressState, GameState, PlayerState, BattleState } from '../reducers'
import { TraceState } from 'src/reducers/trace-reducer'

export interface StoreState {
  progress: ProgressState
  game: GameState
  player: PlayerState
  battle: BattleState
  trace: TraceState
}

export interface StoreAction extends AnyAction {
  type: string
  payload?: object
  error?: boolean
}
