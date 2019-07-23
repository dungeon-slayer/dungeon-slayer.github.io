import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'
import * as Bows from 'bows'
import { StoreState } from 'src/store/interface'
import { ConsumableItem } from 'src/data'
import { PlayerState } from 'src/reducers'
import { InventoryItem } from 'src/common/interfaces'
import { ConsumableHelper } from 'src/helpers'
import { PlayerAction } from 'src/actions'
import ListItem from './ListItem'
import { mediaQueries } from 'src/constants'

const log = Bows('SectionInventory')

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

const ConsumableContainer = styled.div`
  margin-top: 24px;
`

interface Props {
  player: PlayerState
  useConsumable: (consumable: ConsumableItem) => Promise<void>
}

class BaseSectionInventory extends React.Component<Props> {
  componentDidMount() {
    log('componentDidMount triggered.')
  }

  componentWillUnmount() {
    log('componentWillUnmount triggered.')
  }

  operatorClickHandler(consumable: ConsumableItem) {
    log('operatorClickHandler triggered. consumable:', consumable)
    this.props.useConsumable(consumable)
  }

  render(): JSX.Element {
    return (
      <ComponentWrapper>
        {this.renderCaption()}
        {this.renderItems()}
      </ComponentWrapper>
    )
  }

  private renderCaption(): JSX.Element {
    return <CaptionContainer>Inventory</CaptionContainer>
  }

  private renderItems(): JSX.Element | null {
    if (!this.props.player.inventoryItems || this.props.player.inventoryItems.length === 0) {
      return <div>You don't have anything in your inventory...</div>
    }

    return <ConsumableContainer>{this.props.player.inventoryItems.map((item) => this.renderItem(item))}</ConsumableContainer>
  }

  private renderItem(inventoryItem: InventoryItem): JSX.Element | null {
    const consumable = ConsumableHelper.getItemByKey(inventoryItem.consumableKey)

    if (!consumable) {
      log('Failed to find consumable:', inventoryItem.consumableKey)
      return null
    }

    const heading = consumable.name
    const subheading = `(×${inventoryItem.quantity.toLocaleString()})`
    const blurb = consumable.flavor
    const ctaType = 'blue'
    const ctaLabel = 'Use'

    return <ListItem ctaType={ctaType} key={consumable.key} heading={heading} subheading={subheading} blurb={blurb} ctaLabel={ctaLabel} onClick={() => this.operatorClickHandler(consumable)} />
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
    useConsumable: async (consumable: ConsumableItem): Promise<void> => {
      await dispatch(PlayerAction.useConsumable(consumable))
    },
  }
}

const SectionInventory = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseSectionInventory)
export default SectionInventory
