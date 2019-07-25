import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { PlayerState } from 'src/reducers'
import { mediaQueries } from 'src/constants'
import Button from './Button'
import { GameAction } from 'src/actions'

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
  color: #666666;
  line-height: 1.1;
  margin-bottom: 6px;
`

const ConfigOperator = styled.div``

interface Props {
  player: PlayerState
  restartGame: () => Promise<void>
}

class BaseSectionSettings extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
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
    return <CaptionContainer>Settings</CaptionContainer>
  }

  private renderContent(): JSX.Element {
    return (
      <ConfigContainer>
        <ConfigWrapper>
          <ConfigHeader>Reset the game</ConfigHeader>
          <ConfigBlurb>All the saved progress will be wiped out.</ConfigBlurb>
          <ConfigOperator>
            <Button type="red" label="Reset" onClick={() => this.resetHandler()} />
          </ConfigOperator>
        </ConfigWrapper>
      </ConfigContainer>
    )
  }
}

function mapStateToProps(state: StoreState) {
  const { player } = state
  return {
    player,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    restartGame: async (): Promise<void> => {
      await dispatch(GameAction.restart())
      window.location.replace('/')
    },
  }
}

const SectionSettings = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSectionSettings)
export default SectionSettings
