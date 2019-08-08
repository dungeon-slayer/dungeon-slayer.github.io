import * as ReactGA from 'react-ga'
import * as Bows from 'bows'
import { EnvironmentDelegate } from './environment-delegate'

const log = Bows('MetricsDelegate')
const isDebugMode = EnvironmentDelegate.ApplicationEnvironment !== 'production'
let gaEnabled = false // Mutable config

if (EnvironmentDelegate.GoogleAnalyticTrackingId) {
  ReactGA.initialize(EnvironmentDelegate.GoogleAnalyticTrackingId, {
    debug: isDebugMode,
  })
  gaEnabled = true
}

export class MetricsDelegate {
  static pageView(url?: string) {
    log('pageView triggered.')
    if (url === undefined) {
      url = window.location.pathname + window.location.search
    }
    log('url:', url)
    if (gaEnabled) {
      ReactGA.pageview(url)
    }
  }
}
