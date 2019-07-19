import { combineReducers } from 'redux'
import { progress } from './progress-reducer'
import { game } from './game-reducer'
import { player } from './player-reducer'
import { battle } from './battle-reducer'
import { trace } from './trace-reducer'

export const rootReducer = combineReducers({
  progress,
  game,
  player,
  battle,
  trace,
})
