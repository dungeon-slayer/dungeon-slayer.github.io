import * as React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import * as Bows from 'bows'
import { StoreState } from './store/interface'
import { history } from './common/history'
import { ProgressAction } from './actions'
import { DomHelper } from './helpers'
import ViewNotFound from './components/ViewNotFound'
import ViewGame from './components/ViewGame'
import ViewTest from './components/ViewTest'
import { MetricsDelegate } from './delegates/metrics-delegate'

const log = Bows('App')

interface Props {
  setProgressIdle: () => void
}

class App extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    history.listen(this.historyListenHandler.bind(this))
  }

  componentDidMount() {
    log('componentDidMount triggered.')
    log('process.env:', process.env)

    // Analytics
    MetricsDelegate.pageView()
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  render() {
    return (
      <Router history={history}>
        <React.Fragment>
          <Switch>
            <Route exact path="/test" component={ViewTest} />
            <Route exact path="/:dataCode?" component={ViewGame} />
            <Route component={ViewNotFound} />
          </Switch>
        </React.Fragment>
      </Router>
    )
  }

  private historyListenHandler(location: any, action: any) {
    log('historyListenHandler triggered. location:', location, 'action:', action)

    // Arrange configuration on route change
    let config = {
      resetProgress: true,
      scrollToTop: true,
    }
    if (location.state && location.state.routerConfig) {
      config = {
        ...config,
        ...location.state.routerConfig,
      }
    }

    // Act
    const { setProgressIdle } = this.props
    if (config.resetProgress) {
      setProgressIdle()
    }
    if (config.scrollToTop) {
      DomHelper.scrollToTop()
    }
  }
}

function mapStateToProps(state: StoreState) {
  return {}
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setProgressIdle: () => dispatch(ProgressAction.idle()),
  }
}

const connectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
export default connectedApp
