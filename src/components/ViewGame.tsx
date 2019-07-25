import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled, { ThemeProvider } from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { ProgressState, GameState } from 'src/reducers'
import Header from './Header'
import SectionBattle from './SectionBattle'
import { GameAction, BattleAction, TraceAction } from 'src/actions'
import Tabs from './Tabs'
import { SectionHelper, GameHelper } from 'src/helpers'
import SectionLog from './SectionLog'
import { EnvironmentDelegate } from 'src/delegates'

const log = Bows('ViewGame')

const theme = {}
let tickIntervalId: NodeJS.Timeout
let truncateLogIntervalId: NodeJS.Timeout
let saveProgressIntervalId: NodeJS.Timeout

const ComponentWrapper = styled.div`
  max-width: 800px;
  height: 100%;
  margin: 0 auto;
  background-color: white;
`

const MainSection = styled.div`
  padding: 24px;
  background-color: rgba(119, 199, 199, 0.2);
`

const SectionContainer = styled.div`
  margin-top: 24px;
`

const SectionWrapper = styled.div``

interface Props {
  progress: ProgressState
  game: GameState
  appendRandomMob: () => Promise<void>
  performAutoBattle: () => Promise<void>
  performBattle: () => Promise<void>
  truncateLogs: () => Promise<void>
  saveProgress: () => Promise<void>
  loadProgress: () => Promise<void>
}

class BaseViewGame extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')

    this.props.loadProgress()

    tickIntervalId = setInterval(() => this.tick(), GameHelper.getTickIntervalMs(this.props.game, EnvironmentDelegate.TickIntervalMs))
    truncateLogIntervalId = setInterval(() => this.props.truncateLogs(), EnvironmentDelegate.TruncateLogIntervalMs)
    saveProgressIntervalId = setInterval(() => this.props.saveProgress(), EnvironmentDelegate.SaveProgressIntervalMs)
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')

    clearInterval(tickIntervalId)
    clearInterval(truncateLogIntervalId)
    clearInterval(saveProgressIntervalId)
  }

  render(): JSX.Element {
    return (
      <ThemeProvider theme={theme}>
        <ComponentWrapper>
          <Header />
          <SectionLog />
          <SectionBattle />
          <MainSection>
            <Tabs />
            <SectionContainer>{this.renderActiveSection()}</SectionContainer>
          </MainSection>
        </ComponentWrapper>
      </ThemeProvider>
    )
  }

  private renderActiveSection(): JSX.Element {
    const sectionItem = SectionHelper.getItemByKey(this.props.game.activeSection)
    if (!sectionItem) {
      return <div>Unknown Section</div>
    }

    return (
      <SectionWrapper>
        <sectionItem.Component />
      </SectionWrapper>
    )
  }

  private async tick() {
    // log('tick triggered.')
    await this.props.appendRandomMob()
    await this.props.performAutoBattle()
    await this.props.performBattle()
  }
}

function mapStateToProps(state: StoreState) {
  const { progress, game } = state
  return {
    progress,
    game,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    appendRandomMob: async (): Promise<void> => {
      dispatch(GameAction.appendRandomMob())
    },

    performAutoBattle: async (): Promise<void> => {
      dispatch(BattleAction.performAutoBattle())
    },

    performBattle: async (): Promise<void> => {
      dispatch(BattleAction.performBattle())
    },

    truncateLogs: async (): Promise<void> => {
      dispatch(TraceAction.truncateLogs())
    },

    saveProgress: async (): Promise<void> => {
      dispatch(GameAction.saveProgress())
    },

    loadProgress: async (): Promise<void> => {
      dispatch(GameAction.loadProgress())
    },
  }
}

const ViewGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseViewGame)
export default ViewGame
