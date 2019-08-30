import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { ConsumableItem } from 'src/data'
import { PlayerState, BattleState } from 'src/reducers'
import { PlayerHelper } from 'src/helpers'
import { PlayerAction } from 'src/actions'
import ListItem from './ListItem'
import { CtaItem } from 'src/common/interfaces'

const log = Bows('SegmentConsumable')

const ComponentWrapper = styled.div``

const SubcaptionContainer = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin: 24px 0 12px 0;
`

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
  useConsumable: (consumable: ConsumableItem) => Promise<void>
}

class BaseSegmentConsumable extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  async consumableClickHandler(consumable: ConsumableItem) {
    log('consumableClickHandler triggered. consumable:', consumable)
    await this.props.useConsumable(consumable)
  }

  render(): JSX.Element {
    return <ComponentWrapper>{this.renderConsumables()}</ComponentWrapper>
  }

  private renderConsumables(): JSX.Element {
    const availableConsumables = PlayerHelper.getAvailableConsumables(this.props.player)

    let dynamicContent: JSX.Element
    if (availableConsumables.length === 0) {
      dynamicContent = <NoContentWrapper>You do not have any consumables in your inventory.</NoContentWrapper>
    } else {
      dynamicContent = <React.Fragment>{availableConsumables.map((item) => this.renderConsumable(item))}</React.Fragment>
    }

    return (
      <React.Fragment>
        <SubcaptionContainer role="heading" aria-level={2}>
          Consumables
        </SubcaptionContainer>
        <DescriptionContainer>
          <DescriptionWrapper>Items that may help you throughout the adventure.</DescriptionWrapper>
        </DescriptionContainer>
        <ConsumableContainer>{dynamicContent}</ConsumableContainer>
      </React.Fragment>
    )
  }

  private renderConsumable(consumable: ConsumableItem): JSX.Element | null {
    const availableItem = PlayerHelper.getAvailableItemByKey(this.props.player.availableConsumables!, consumable.key)
    if (!availableItem) {
      log('Failed to find available item for consumable key:', consumable.key)
      return null
    }

    const heading = consumable.name
    const subheading = `(×${availableItem.quantity.toLocaleString()})`
    const flavor = consumable.flavor
    const ctaItem: CtaItem = {
      type: 'blue',
      label: 'Use',
      onClick: () => this.consumableClickHandler(consumable),
    }
    if (PlayerHelper.isInFightingMode(this.props.player, this.props.battle)) {
      ctaItem.type = 'disabled'
    }

    return <ListItem key={consumable.key} heading={heading} subheading={subheading} flavor={flavor} ctaItems={[ctaItem]} ctaMinWidth="100px" />
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
    useConsumable: async (consumable: ConsumableItem): Promise<void> => {
      await dispatch(PlayerAction.useConsumable(consumable))
    },
  }
}

const SegmentConsumable = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSegmentConsumable)
export default SegmentConsumable
