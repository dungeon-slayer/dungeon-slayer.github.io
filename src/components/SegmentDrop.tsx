import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { PlayerState, BattleState } from 'src/reducers'
import { PlayerHelper } from 'src/helpers'
import ListItem from './ListItem'
import AccordionContainer from './AccordionContainer'
import { PossessionItem } from 'src/common/interfaces'

const log = Bows('SegmentDrop')

const ComponentWrapper = styled.div``

// const SegmentCaptionContainer = styled.div`
//   font-size: 20px;
//   font-weight: bold;
//   margin: 24px 0 12px 0;
// `

const DescriptionContainer = styled.div``

const DescriptionWrapper = styled.div`
  margin: 4px 0;
`

const NoContentWrapper = styled(DescriptionWrapper)`
  color: #dc0073;
`

const DropContainer = styled.div`
  margin-top: 24px;
`

interface Props {
  player: PlayerState
  battle: BattleState
}

class BaseSegmentDrop extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        <AccordionContainer componentKey="drops" caption="Obtained Drops">
          {this.renderDrops()}
        </AccordionContainer>
      </ComponentWrapper>
    )
  }

  private renderDrops(): JSX.Element {
    const availablePossessions = PlayerHelper.getAvailablePossessions(this.props.player)

    let dynamicContent: JSX.Element
    if (availablePossessions.length === 0) {
      dynamicContent = <NoContentWrapper>You do not have any drops in your inventory.</NoContentWrapper>
    } else {
      dynamicContent = <React.Fragment>{availablePossessions.map((item) => this.renderDrop(item))}</React.Fragment>
    }

    return (
      <React.Fragment>
        <DescriptionContainer>
          <DescriptionWrapper>Collectable items from all those battle rewards.</DescriptionWrapper>
        </DescriptionContainer>
        <DropContainer>{dynamicContent}</DropContainer>
      </React.Fragment>
    )
  }

  private renderDrop(possession: PossessionItem): JSX.Element | null {
    const availableItem = PlayerHelper.getAvailableItemByKey(this.props.player.availablePossessions!, possession.key)
    if (!availableItem) {
      log('Failed to find available item for drop key:', possession.key)
      return null
    }

    const heading = possession.name
    const subheading = `(×${availableItem.quantity.toLocaleString()})`
    const flavor = possession.flavor

    return <ListItem key={possession.key} heading={heading} subheading={subheading} blurb={flavor} ctaItems={[]} />
  }
}

function mapStateToProps(state: StoreState) {
  const { player, battle } = state
  return {
    player,
    battle,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {}
}

const SegmentDrop = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSegmentDrop)
export default SegmentDrop
