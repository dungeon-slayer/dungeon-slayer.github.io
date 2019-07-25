import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import { css } from 'glamor'
import ScrollToBottom from 'react-scroll-to-bottom'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { TraceState } from 'src/reducers/trace-reducer'
import { LogItem } from 'src/common/interfaces'
import { DateHelper, HtmlParseHelper } from 'src/helpers'
import { RandomHelper } from '../helpers/random-helper'

const log = Bows('SectionLog')

const ComponentWrapper = styled.div`
  padding: 24px;
  background-color: rgba(119, 199, 199, 0.2);
`

const LogContainer = styled.div``

const LogWrapper = styled.div`
  display: flex;
  padding: 4px 0;
  font-size: 12px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`

const LogTimestamp = styled.div`
  color: #6f88c5;
`

const LogMessage = styled.div`
  margin-left: 6px;
`

interface Props {
  trace: TraceState
}

class BaseSectionLog extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  render(): JSX.Element {
    const ROOT_CSS = css({
      height: 150,
    })
    return (
      <ComponentWrapper>
        <ScrollToBottom className={ROOT_CSS}>{this.renderContent()}</ScrollToBottom>
      </ComponentWrapper>
    )
  }

  private renderContent(): JSX.Element | null {
    if (this.props.trace.logs.length === 0) {
      return <div>No logs...</div>
    }

    return <LogContainer>{this.props.trace.logs.map((item) => this.renderItem(item))}</LogContainer>
  }
  private renderItem(item: LogItem): JSX.Element {
    const key = item.timestamp + '_' + RandomHelper.generateId()
    const timeLabel = `[${DateHelper.getTimeLabel(item.timestamp)}]`
    const message = HtmlParseHelper.parse(item.message)

    return (
      <LogWrapper key={key}>
        <LogTimestamp>{timeLabel}</LogTimestamp>
        <LogMessage>{message}</LogMessage>
      </LogWrapper>
    )
  }
}

function mapStateToProps(state: StoreState) {
  const { trace } = state
  return {
    trace,
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
