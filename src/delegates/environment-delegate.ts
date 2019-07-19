import { CastHelper } from '../helpers'

export class EnvironmentDelegate {
  static get ReduxLoggerEnabled(): boolean {
    return CastHelper.toBoolean(process.env.REACT_APP_REDUX_LOGGER_ENABLED)
  }

  static get DefaultGameSpeed(): number {
    return CastHelper.toNumber(process.env.REACT_APP_DEFAULT_GAME_SPEED)
  }

  static get TickIntervalMs(): number {
    return CastHelper.toNumber(process.env.REACT_APP_TICK_INTERVAL_MS)
  }

  static get MobGenerateIntervalMs(): number {
    return CastHelper.toNumber(process.env.REACT_APP_MOB_GENERATE_INTERVAL_MS)
  }

  static get TruncateLogIntervalMs(): number {
    return CastHelper.toNumber(process.env.REACT_APP_TRUNCATE_LOG_INTERVAL_MS)
  }

  static get SaveProgressIntervalMs(): number {
    return CastHelper.toNumber(process.env.REACT_APP_SAVE_PROGRESS_INTERVAL_MS)
  }
}
