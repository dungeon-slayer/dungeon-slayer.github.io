import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled, { ThemeProvider } from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { ProgressState, GameState } from 'src/reducers'
import Header from './Header'
import SectionBattle from './SectionBattle'
import { GameAction, BattleAction, TraceAction, ControlAction } from 'src/actions'
import Tabs from './Tabs'
import { SectionHelper, GameHelper } from 'src/helpers'
import SectionLog from './SectionLog'
import { EnvironmentDelegate } from 'src/delegates'
import { mediaQueries } from 'src/constants'

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

  @media ${mediaQueries.xlargeUp} {
    // max-width: none;
    max-width: 2160px;
  }
`

const BodyContainer = styled.div`
  @media ${mediaQueries.xlargeUp} {
    display: flex;
    flex-direction: row-reverse;
  }
`

const MainContainer = styled.div`
  @media ${mediaQueries.xlargeUp} {
    flex-grow: 1;
    flex-basis: 50%;
    padding: 0 12px;
    height: calc(100vh - 40px);
    overflow: auto;
  }
`

const LogContainer = styled.div`
  @media ${mediaQueries.xlargeUp} {
    flex-grow: 1;
    flex-basis: 50%;
    // padding: 0 12px;
    height: calc(100vh - 40px);
  }
`

const MainSection = styled.div`
  padding: 24px;
  background-color: rgba(119, 199, 199, 0.2);
`

const SectionContainer = styled.div`
  margin-top: 24px;
`

const SectionWrapper = styled.div`
  padding-bottom: 48px;
`

interface Props {
  match: any
  location: Location
  progress: ProgressState
  game: GameState
  appendRandomMob: () => Promise<void>
  performAutoBattle: () => Promise<void>
  performBattle: () => Promise<void>
  truncateLogs: () => Promise<void>
  saveProgress: () => Promise<void>
  loadProgress: () => Promise<void>
  applyDataCode: (dataCode: string) => Promise<void>
}

class BaseViewGame extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')

    this.initLoading()

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
          <BodyContainer>
            <LogContainer>
              <SectionLog />
            </LogContainer>
            <MainContainer>
              <SectionBattle />
              <MainSection>
                <Tabs />
                <SectionContainer>{this.renderActiveSection()}</SectionContainer>
              </MainSection>
            </MainContainer>
          </BodyContainer>
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

  private async initLoading() {
    const { dataCode } = this.props.match.params
    if (!dataCode) {
      // Standard loading
      this.props.loadProgress()
      return
    }

    // Act on data code
    log('params:', this.props.match.params)
    this.props.applyDataCode(dataCode)

    // Force refresh page to clean the dataCode from URL
    window.location.replace('/')
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
      dispatch(ControlAction.saveProgress())
    },

    loadProgress: async (): Promise<void> => {
      dispatch(ControlAction.loadProgress())
    },

    applyDataCode: async (dataCode: string): Promise<void> => {
      dispatch(ControlAction.applyDataCode(dataCode))
    },
  }
}

const ViewGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseViewGame)
export default ViewGame
