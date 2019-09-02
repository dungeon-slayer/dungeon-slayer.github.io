import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { PlayerState, BattleState } from 'src/reducers'
import { PlayerHelper } from 'src/helpers'
import { PlayerAction } from 'src/actions'
import ListItem from './ListItem'
import { CtaItem, PossessionItem } from 'src/common/interfaces'
import AccordionContainer from './AccordionContainer'

const log = Bows('SegmentConsumable')

const ComponentWrapper = styled.div``

const DescriptionContainer = styled.div``

const DescriptionWrapper = styled.div`
  margin: 4px 0;
`

const NoContentWrapper = styled(DescriptionWrapper)`
  color: #dc0073;
`

const ConsumableContainer = styled.div`
  margin-top: 24px;
`

interface Props {
  player: PlayerState
  battle: BattleState
  usePossession: (possession: PossessionItem) => Promise<void>
}

class BaseSegmentConsumable extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  async consumableClickHandler(possession: PossessionItem) {
    log('consumableClickHandler triggered. possession:', possession)
    await this.props.usePossession(possession)
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        <AccordionContainer componentKey="consumables" caption="Consumables">
          {this.renderConsumables()}
        </AccordionContainer>
      </ComponentWrapper>
    )
  }

  private renderConsumables(): JSX.Element {
    const availablePossessions = PlayerHelper.getAvailablePossessions(this.props.player)

    let dynamicContent: JSX.Element
    if (availablePossessions.length === 0) {
      dynamicContent = <NoContentWrapper>You do not have any consumables in your inventory.</NoContentWrapper>
    } else {
      dynamicContent = <React.Fragment>{availablePossessions.map((item) => this.renderConsumable(item))}</React.Fragment>
    }

    return (
      <React.Fragment>
        <DescriptionContainer>
          <DescriptionWrapper>Items that may help you throughout the adventure.</DescriptionWrapper>
        </DescriptionContainer>
        <ConsumableContainer>{dynamicContent}</ConsumableContainer>
      </React.Fragment>
    )
  }

  private renderConsumable(possession: PossessionItem): JSX.Element | null {
    const availableItem = PlayerHelper.getAvailableItemByKey(this.props.player.availablePossessions!, possession.key)
    if (!availableItem) {
      log('Failed to find available item for consumable key:', possession.key)
      return null
    }

    const heading = possession.name
    const subheading = `(×${availableItem.quantity.toLocaleString()})`
    const flavor = possession.flavor
    const ctaItem: CtaItem = {
      type: 'blue',
      label: 'Use',
      onClick: () => this.consumableClickHandler(possession),
    }
    if (PlayerHelper.isInFightingMode(this.props.player, this.props.battle)) {
      ctaItem.type = 'disabled'
    }

    return <ListItem key={possession.key} heading={heading} subheading={subheading} blurb={flavor} ctaItems={[ctaItem]} ctaMinWidth="100px" />
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
  return {
    usePossession: async (possession: PossessionItem): Promise<void> => {
      await dispatch(PlayerAction.usePossession(possession))
    },
  }
}

const SegmentConsumable = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSegmentConsumable)
export default SegmentConsumable
