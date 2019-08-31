import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { PlayerState, GameState } from 'src/reducers'
import { mediaQueries } from 'src/constants'
import Button from './Button'
import { ControlAction } from 'src/actions'
import Select from './Select'
import { SelectItem } from 'src/common/interfaces'
import { CastHelper } from 'src/helpers'

const log = Bows('SectionSettings')

const ComponentWrapper = styled.div``

const CaptionContainer = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 24px;

  @media ${mediaQueries.mediumUp} {
    display: none;
  }
`

const ConfigContainer = styled.div`
  border: solid 1px #93c6d4;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 12px;

  @media ${mediaQueries.mediumUp} {
    padding: 24px;
  }
`

const ConfigWrapper = styled.div`
  // margin: 12px 0;
  margin-bottom: 12px;
`

const ConfigHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 6px;
`

const ConfigBlurb = styled.div`
  color: #838383;
  line-height: 1.1;
  margin-bottom: 6px;
`

const ConfigOperator = styled.div`
  width: 100px;
`

interface Props {
  game: GameState
  player: PlayerState
  setGameSpeed: (clockSpeedMultiplier: number) => Promise<void>
  restartGame: () => Promise<void>
}

class BaseSectionSettings extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  async gameSpeedChangeHandler(e: Event) {
    log('gameSpeedChangeHandler triggered. e:', e)
    const { value } = e.target as any
    const valueNumber = CastHelper.toNumber(value)
    this.props.setGameSpeed(valueNumber)
  }

  async resetHandler() {
    log('resetHandler triggered.')
    await this.props.restartGame()
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        {this.renderCaption()}
        {this.renderContent()}
      </ComponentWrapper>
    )
  }

  private renderCaption(): JSX.Element {
    return (
      <CaptionContainer role="heading" aria-level={1}>
        Settings
      </CaptionContainer>
    )
  }

  private renderContent(): JSX.Element {
    return (
      <ConfigContainer>
        {false && this.renderGameSpeed()}
        {this.renderResetGame()}
      </ConfigContainer>
    )
  }

  private renderGameSpeed(): JSX.Element {
    const clockSpeedMultiplierText = this.props.game.clockSpeedMultiplier!.toString()

    // prettier-ignore
    const gameSpeedOptions: SelectItem[] = [
      { value: '1', label: 'Speed ×1' },
      { value: '2', label: 'Speed ×2' },
      { value: '3', label: 'Speed ×3' },
    ]

    return (
      <ConfigWrapper>
        <ConfigHeader>Game speed</ConfigHeader>
        <ConfigBlurb>Change the speed at which your game runs.</ConfigBlurb>
        <ConfigOperator>
          <Select selectedValue={clockSpeedMultiplierText} options={gameSpeedOptions} onChange={(e: Event) => this.gameSpeedChangeHandler(e)} />
        </ConfigOperator>
      </ConfigWrapper>
    )
  }

  private renderResetGame(): JSX.Element {
    return (
      <ConfigWrapper>
        <ConfigHeader>Reset the game</ConfigHeader>
        <ConfigBlurb>All the saved progress will be wiped out.</ConfigBlurb>
        <ConfigOperator>
          <Button type="red" label="Reset" onClick={() => this.resetHandler()} />
        </ConfigOperator>
      </ConfigWrapper>
    )
  }
}

function mapStateToProps(state: StoreState) {
  const { game, player } = state
  return {
    game,
    player,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setGameSpeed: async (clockSpeedMultiplier: number): Promise<void> => {
      await dispatch(ControlAction.setGameSpeed(clockSpeedMultiplier))
    },

    restartGame: async (): Promise<void> => {
      await dispatch(ControlAction.restart())
      window.location.replace('/')
    },
  }
}

const SectionSettings = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSectionSettings)
export default SectionSettings
