import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
// import { reverse } from 'lodash'
// import { css } from 'glamor'
import * as Bows from 'bows'
import { GiBroadsword, GiScrollUnfurled, GiPotionBall, GiBootPrints, GiShakingHands } from 'react-icons/gi'
import { MdChatBubbleOutline } from 'react-icons/md'
import { StoreState } from 'src/store/interface'
import { TraceState } from 'src/reducers/trace-reducer'
import { LogItem, LogType } from 'src/common/interfaces'
import { DateHelper, HtmlParseHelper } from 'src/helpers'
import { RandomHelper } from '../helpers/random-helper'
import { mediaQueries } from 'src/constants'
import { GameState } from 'src/reducers'

const log = Bows('SectionLog')

const ComponentWrapper = styled.div`
  // padding: 24px;
  background-color: rgba(119, 199, 199, 0.2);
  // height: calc(100% - 48px);
  height: 100%;
  overflow: auto;
`

const LogContainer = styled.div`
  height: 150px;

  @media ${mediaQueries.xlargeUp} {
    height: 100%;
  }
`

const LogWrapper = styled.div`
  display: flex;
  // padding: 4px 0;
  padding: 4px 24px;
  // font-size: 12px;
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
`

const SpecialLogWrapper = styled(LogWrapper)``

const LogTimestamp = styled.div`
  color: #6f88c5;
`

const LogIcon = styled.div`
  margin: 3px 0 0 6px;
  color: #6f88c5;
  font-size: 10px;
`

const LogMessage = styled.div`
  margin-left: 6px;
`

const LoreLogMessage = styled(LogMessage)`
  color: #dc004e;
`

interface Props {
  trace: TraceState
  game: GameState
}

class BaseSectionLog extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  get logs(): LogItem[] {
    return this.props.trace.logs
  }

  render(): JSX.Element {
    return <ComponentWrapper>{this.renderContent()}</ComponentWrapper>
  }

  private renderContent(): JSX.Element | null {
    if (!this.props.game.displayLogs) {
      return (
        <LogContainer>
          <SpecialLogWrapper>Logs disabled</SpecialLogWrapper>
        </LogContainer>
      )
    }

    if (this.logs.length === 0) {
      return (
        <LogContainer>
          <SpecialLogWrapper>No logs...</SpecialLogWrapper>
        </LogContainer>
      )
    }

    return <LogContainer>{this.logs.map((item) => this.renderItem(item))}</LogContainer>
  }

  private renderItem(item: LogItem): JSX.Element {
    const key = item.timestamp + '_' + RandomHelper.generateId()
    const timeLabel = `[${DateHelper.getTimeLabel(item.timestamp)}]`
    const _Icon = this.getIconByLogType(item.type)

    return (
      <LogWrapper key={key}>
        <LogTimestamp>{timeLabel}</LogTimestamp>
        <LogIcon>
          <_Icon />
        </LogIcon>
        {this.renderMessage(item)}
      </LogWrapper>
    )
  }

  private renderMessage(item: LogItem): JSX.Element {
    const message = HtmlParseHelper.parse(item.message)
    const _Message = item.type === 'lore' ? LoreLogMessage : LogMessage
    return <_Message>{message}</_Message>
  }

  private getIconByLogType(logType: LogType): any {
    switch (logType) {
      case 'battle':
        return GiBroadsword
      case 'lore':
        return GiScrollUnfurled
      case 'travel':
        return GiBootPrints
      case 'consume':
        return GiPotionBall
      case 'shop':
        return GiShakingHands
      default:
        return MdChatBubbleOutline
    }
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
