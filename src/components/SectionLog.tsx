import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as $ from 'jquery'
import { difference, clone, sortBy } from 'lodash'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { TraceState } from 'src/reducers/trace-reducer'
import { GameState } from 'src/reducers'
import { LogItem } from 'src/common/interfaces'
import { DateHelper } from 'src/helpers'
import { mediaQueries } from 'src/constants'

const log = Bows('SectionLog')
let refreshLogsIntervalId: NodeJS.Timeout

const ComponentWrapper = styled.div`
  background-color: rgba(119, 199, 199, 0.2);
  height: 100%;
  overflow: auto;
`

const LogContainer = styled.div`
  height: 150px;

  @media ${mediaQueries.xlargeUp} {
    height: 100%;
  }

  .log-item {
    display: flex;
    padding: 4px 24px;
    transition: background-color 0.3s;

    &:nth-child(1) {
      background-color: rgba(0, 0, 0, 0.03);
    }
    &:nth-child(2) {
      background-color: rgba(0, 0, 0, 0.02);
    }
    &:nth-child(3) {
      background-color: rgba(0, 0, 0, 0.01);
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .log-ts {
      color: #6f88c5;
    }

    .log-msg {
      margin-left: 6px;
    }

    &.lore {
      .log-msg {
        color: #dc004e;
      }
    }
  }
`

interface Props {
  trace: TraceState
  game: GameState
}

interface State {
  logs: LogItem[]
}

const defaultState: State = {
  logs: [],
}

class BaseSectionLog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = defaultState
  }

  componentDidMount() {
    log('componentDidMount triggered.')

    refreshLogsIntervalId = setInterval(() => this.reviewLogs(), 300)
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')

    clearInterval(refreshLogsIntervalId)
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        <LogContainer id="logs" />
      </ComponentWrapper>
    )
  }

  private reviewLogs() {
    // log('reviewLogs triggered.')

    const addLogs = sortBy(difference(this.props.trace.logs, this.state.logs), (item) => item.timestamp)
    const removeLogs = sortBy(difference(this.state.logs, this.props.trace.logs), (item) => item.timestamp)
    const logsElem = $('#logs')

    for (const logItem of addLogs) {
      this.addLog(logItem, logsElem)
    }

    for (const logItem of removeLogs) {
      this.removeLog(logItem, logsElem)
    }

    // Store changes to component state
    if (addLogs.length > 0 || removeLogs.length > 0) {
      this.setState({
        logs: clone(this.props.trace.logs),
      })
    }
  }

  private addLog(logItem: LogItem, logsElem: JQuery<HTMLElement>) {
    const logElem = this.getLogElement(logItem)
    $(logsElem).prepend(logElem)
  }

  private removeLog(logItem: LogItem, logsElem: JQuery<HTMLElement>) {
    // log('removeLog triggered. logItem:', logItem)
    logsElem.find(`[data-ts="${logItem.timestamp}"]`).remove()
  }

  private getLogElement(logItem: LogItem): JQuery<HTMLElement> {
    const logElem = $('<div />', { class: `log-item ${logItem.type}` })
    logElem.attr('data-ts', logItem.timestamp)

    const logTsElem = $('<div />', { class: `log-ts` })
    logTsElem.text(`[${DateHelper.getTimeLabel(logItem.timestamp)}]`)
    logElem.append(logTsElem)

    const logMsgElem = $('<div />', { class: `log-msg` })
    logMsgElem.html(logItem.message)
    logElem.append(logMsgElem)

    return logElem
  }
}

function mapStateToProps(state: StoreState) {
  const { trace, game } = state
  return {
    trace,
    game,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {}
}

const SectionLog = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSectionLog)
export default SectionLog
