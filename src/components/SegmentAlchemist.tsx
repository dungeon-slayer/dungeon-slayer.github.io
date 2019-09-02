import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { PlayerState, BattleState, GameState } from 'src/reducers'
import AccordionContainer from './AccordionContainer'

const log = Bows('SegmentAlchemist')

const ComponentWrapper = styled.div``

// const DescriptionContainer = styled.div``

// const DescriptionWrapper = styled.div`
//   margin: 4px 0;
// `

// const DropContainer = styled.div`
//   margin-top: 24px;
// `

// const NoDropContainer = styled(DropContainer)`
//   color: #dc0073;
// `

interface Props {
  player: PlayerState
  battle: BattleState
  game: GameState
}

class BaseSegmentAlchemist extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        <AccordionContainer componentKey="alchemist" caption="Alchemist">
          {/* {this.renderAlchemist()} */}
          [TODO]
        </AccordionContainer>
      </ComponentWrapper>
    )
  }
}

function mapStateToProps(state: StoreState) {
  const { player, battle, game } = state
  return {
    player,
    battle,
    game,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {}
}

const SegmentAlchemist = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSegmentAlchemist)
export default SegmentAlchemist
